import { NextResponse } from "next/server";
import {
  getMedicalRecords,
  getMedicalRecordsCount,
  createMedicalRecord,
} from "@/lib/db/queries";

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

    console.log("medical record count", totalItems);

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
      patientId,
      doctorId,
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
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { error: "Failed to create medical record" },
      { status: 500 }
    );
  }
}
