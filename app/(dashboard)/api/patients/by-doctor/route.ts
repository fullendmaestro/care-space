import { NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { patient, appointment, user } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get("doctorId");
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10);

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    // Correct query to fetch unique patients with appointments for the given doctor
    const result = await db
      .select({
        id: patient.id,
        patientId: patient.patientId,
        name: user.name,
        age: sql`details->>'age'`.as("age"), // Assuming age is stored in details JSON
        gender: sql`details->>'gender'`.as("gender"), // Assuming gender is stored in details JSON
        status: patient.status,
        image: user.image,
      })
      .from(patient)
      .innerJoin(user, eq(patient.userId, user.id))
      .innerJoin(appointment, eq(patient.id, appointment.patientId))
      .where(eq(appointment.doctorId, doctorId))
      .orderBy(desc(patient.updatedAt))
      .limit(limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching patients by doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
