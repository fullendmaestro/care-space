import { NextResponse } from "next/server";
import { aliasedTable, eq } from "drizzle-orm";
import {
  getAppointments,
  getAppointmentsCount,
  createAppointment,
  db,
} from "@/lib/db/queries";
import { appointment, patient, staff, user } from "@/lib/db/schema";

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

    console.log(body);

    // Validate required fields
    if (!body.patientEmail || !body.doctorEmail || !body.appointmentDate) {
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

    // Determine the patientId from email
    const patientRecord = await db
      .select({ id: patient.id })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id))
      .where(eq(user.email, body.patientEmail))
      .limit(1);

    if (!patientRecord.length) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const patientId = patientRecord[0].id;

    // Determine the doctorId from email
    const doctorRecord = await db
      .select({ id: staff.id })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .where(eq(user.email, body.doctorEmail))
      .limit(1);

    if (!doctorRecord.length) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    const doctorId = doctorRecord[0].id;

    const appointment = {
      patientId,
      doctorId,
      appointmentDate: body.appointmentDate,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status,
      reason: body.reason,
      notes: body.notes,
    };

    await createAppointment(appointment);
    // Broadcast the update to all subscribed clients
    if (global.broadcastUpdate) {
      global.broadcastUpdate("appointments", {
        action: "create",
        data: "appointment created",
      });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
