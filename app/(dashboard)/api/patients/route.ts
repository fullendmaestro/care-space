import { NextResponse } from "next/server";
import { getPatients, createPatient, getPatientsCount } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "5", 10); // Default to 5 if not provided
    const search = url.searchParams.get("search") || undefined;
    const status = url.searchParams.get("status") || undefined;

    const patients = await getPatients(page, limit, search, status);
    const totalItems = await getPatientsCount(search, status);

    return NextResponse.json(patients, {
      headers: {
        "x-total-count": totalItems.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
