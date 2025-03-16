import { NextResponse } from "next/server";
import { getStaff, createStaff, getStaffCount } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "5", 10);
    const search = url.searchParams.get("search") || undefined;
    const role = url.searchParams.get("role") || undefined;

    const staff = await getStaff(page, limit, search, role);
    const totalItems = await getStaffCount(search, role);

    return NextResponse.json(staff, {
      headers: {
        "x-total-count": totalItems.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}
