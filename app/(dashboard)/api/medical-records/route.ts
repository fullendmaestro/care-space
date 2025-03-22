import { NextResponse } from "next/server";
import { aliasedTable, eq } from "drizzle-orm";
import {
  getMedicalRecords,
  getMedicalRecordsCount,
  createMedicalRecord,
  db,
} from "@/lib/db/queries";
import { user, patient, staff } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || undefined;
    const patientId = url.searchParams.get("patientId") || undefined;
    const doctorId = url.searchParams.get("doctorId") || undefined;

    const medicalRecords = await getMedicalRecords(
      page,
      limit,
      search,
      patientId,
      doctorId
    );
    const totalItems = await getMedicalRecordsCount(
      search,
      patientId,
      doctorId
    );

    return NextResponse.json(medicalRecords, {
      headers: {
        "x-total-count": totalItems.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      patientEmail,
      doctorEmail,
      diagnosis,
      treatment,
      prescription,
      notes,
      visitDate,
    } = await request.json();
    // Convert visitDate to a proper Date object
    const parsedVisitDate = visitDate ? new Date(visitDate) : new Date();

    // Validate that the date is valid
    if (isNaN(parsedVisitDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid visit date format" },
        { status: 400 }
      );
    }

    // Fetch patientId based on patientEmail
    const dbpatient = await db
      .select({ id: patient.id })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id))
      .where(eq(user.email, patientEmail))
      .limit(1);
    if (!dbpatient.length) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const patientId = dbpatient[0].id;

    // Fetch doctorId based on doctorEmail
    const doctor = await db
      .select({ id: staff.id })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .where(eq(user.email, doctorEmail))
      .limit(1);
    if (!doctor.length) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    const doctorId = doctor[0].id;

    const record = {
      patientId,
      doctorId,
      diagnosis,
      treatment,
      prescription,
      notes,
      visitDate: parsedVisitDate,
    };

    await createMedicalRecord(record);
    // Broadcast the update to all subscribed clients
    if (global.broadcastUpdate) {
      global.broadcastUpdate("medical_records", {
        action: "update",
        data: "record created",
      });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { error: "Failed to create medical record" },
      { status: 500 }
    );
  }
}
