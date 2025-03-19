import { NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { patient, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    console.log("provided email", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await db
      .select({
        id: patient.id,
        userId: patient.userId,
        patientId: patient.patientId,
        status: patient.status,
        details: patient.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id))
      .where(eq(user.email, email));

    if (result.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching patient by email:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}
