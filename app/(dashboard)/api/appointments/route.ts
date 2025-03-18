import { NextResponse } from "next/server";
import {
  getAppointments,
  getAppointmentsCount,
  createAppointment,
} from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const doctorId = url.searchParams.get("doctorId") || undefined;
    const patientId = url.searchParams.get("patientId") || undefined;

    const appointments = await getAppointments(
      page,
      limit,
      search,
      status,
      doctorId,
      patientId
    );
    const totalItems = await getAppointmentsCount(
      search,
      status,
      doctorId,
      patientId
    );

    return NextResponse.json(appointments, {
      headers: {
        "x-total-count": totalItems.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.patientId || !body.doctorId || !body.appointmentDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert appointmentDate to a proper Date object
    try {
      const parsedDate = new Date(body.appointmentDate);

      // Validate that the date is valid
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid appointment date format" },
          { status: 400 }
        );
      }

      // Replace the string with the Date object
      body.appointmentDate = parsedDate;
    } catch (dateError) {
      return NextResponse.json(
        { error: "Invalid appointment date" },
        { status: 400 }
      );
    }

    await createAppointment(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
