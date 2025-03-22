import { db } from "@/lib/db/queries";
import { patient } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total count of patient
    const totalCount = await db.select({ count: sql`count(*)` }).from(patient);

    // Get count by status
    const statusCounts = await db
      .select({
        status: patient.status,
        count: sql`count(*)`,
      })
      .from(patient)
      .groupBy(patient.status);

    return NextResponse.json({
      totalCount: totalCount[0].count,
      statusCounts,
    });
  } catch (error) {
    console.error("Error fetching patient stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient statistics" },
      { status: 500 }
    );
  }
}
