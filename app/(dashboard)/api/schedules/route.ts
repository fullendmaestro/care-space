import { NextResponse } from "next/server";
import { getDoctorSchedules, createDoctorSchedule } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const schedules = await getDoctorSchedules(doctorId);

    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createDoctorSchedule(body);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}
