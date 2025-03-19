import { NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import {
  appointment,
  medicalRecord,
  patient,
  staff,
  user,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { aliasedTable } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pid = url.searchParams.get("patientId");

    if (!pid) {
      return NextResponse.json(
        { error: "Patient Id is required" },
        { status: 400 }
      );
    }

    const doctorUser = aliasedTable(user, "doctorUser");

    const result = await db
      .select({
        diagnosis: medicalRecord.diagnosis,
        treatment: medicalRecord.treatment,
        prescription: medicalRecord.prescription,
        notes: medicalRecord.notes,
        visitDate: medicalRecord.visitDate,
        doctorName: doctorUser.name,
        doctorEmail: doctorUser.email,
      })
      .from(medicalRecord)
      .leftJoin(patient, eq(medicalRecord.patientId, patient.id))
      .leftJoin(staff, eq(medicalRecord.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id))
      .where(eq(medicalRecord.patientId, pid));

    if (result.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching records by pid:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient record" },
      { status: 500 }
    );
  }
}
