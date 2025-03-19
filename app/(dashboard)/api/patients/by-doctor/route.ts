import { NextResponse } from "next/server"
import { db } from "@/lib/db/queries"
import { patient, appointment } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const doctorId = url.searchParams.get("doctorId")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    // Get unique patients who have appointments with this doctor
    const result = await db
      .select({
        id: patient.id,
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        status: patient.status,
        image: patient.image,
      })
      .from(patient)
      .innerJoin(appointment, eq(patient.id, appointment.patientId))
      .where(eq(appointment.doctorId, doctorId))
      .groupBy(patient.id)
      .orderBy(desc(patient.updatedAt))
      .limit(limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching patients by doctor:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

