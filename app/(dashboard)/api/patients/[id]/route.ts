import { NextResponse } from "next/server";
import { getPatientById, updatePatient, deletePatient } from "@/lib/db/queries";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;

    const patient = await getPatientById(id);
    if (!patient || patient.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(patient[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;

    const body = await request.json();
    await updatePatient(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update patient" },
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

    await deletePatient(id);
    if (global.broadcastUpdate) {
      global.broadcastUpdate("patients", {
        action: "create",
        data: "record created",
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
