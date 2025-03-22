import { NextResponse } from "next/server";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/db/queries";
import { NextApiRequest } from "next";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    const appointment = await getAppointmentById(id);
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

export async function PUT(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    const body = await request.json();
    await updateAppointment(id, body);
    if (global.broadcastUpdate) {
      global.broadcastUpdate("appointments", {
        action: "update",
        data: "appoinments updated",
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    await deleteAppointment(id);
    if (global.broadcastUpdate) {
      global.broadcastUpdate("appointments", {
        action: "delete",
        data: "appoinment deleted",
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
