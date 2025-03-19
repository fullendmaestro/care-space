import { NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { appointment, patient, user, staff } from "@/lib/db/schema";
import { aliasedTable, eq } from "drizzle-orm";

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

    const patientUser = aliasedTable(user, "patientUser"); // Alias for patient user
    const doctorUser = aliasedTable(user, "doctorUser"); // Alias for doctor user

    const result = await db
      .select({
        appointmentId: appointment.id,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes,
        patientName: patientUser.name,
        patientEmail: patientUser.email,
        doctorName: doctorUser.name,
        doctorEmail: doctorUser.email,
        staffDetail: staff.details,
      })
      .from(appointment)
      .leftJoin(patient, eq(patient.id, appointment.patientId))
      .leftJoin(patientUser, eq(patient.userId, patientUser.id))
      .leftJoin(staff, eq(appointment.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id))
      .where(eq(appointment.patientId, pid));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "No appointments found for the patient" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching appointments by patient ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
