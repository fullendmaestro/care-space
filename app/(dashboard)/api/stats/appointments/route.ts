import { db } from "@/lib/db/queries";
import { appointment } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total count of appointment
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(appointment);

    // Get count by status
    const statusCounts = await db
      .select({
        status: appointment.status,
        count: sql`count(*)`,
      })
      .from(appointment)
      .groupBy(appointment.status);

    return NextResponse.json({
      totalCount: totalCount[0].count,
      statusCounts,
    });
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment statistics" },
      { status: 500 }
    );
  }
}
