import { NextRequest, NextResponse } from "next/server";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/db/queries";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const appointment = await getAppointmentById(context.params.id);
    if (!appointment || appointment.length === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(appointment[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const body = await request.json();
    await updateAppointment(context.params.id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    await deleteAppointment(context.params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
