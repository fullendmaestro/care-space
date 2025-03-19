import { NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { staff, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await db
      .select({
        id: staff.id,
        userId: staff.userId,
        isActive: staff.isActive,
        details: staff.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .where(eq(user.email, email));

    if (result.length === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching staff by email:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}
