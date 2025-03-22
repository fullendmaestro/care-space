import { NextResponse } from "next/server";
import {
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "@/lib/db/queries";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    const medicalRecord = await getMedicalRecordById(id);
    if (!medicalRecord || medicalRecord.length === 0) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(medicalRecord[0]);
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical record" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    const body = await request.json();
    const updatedBody = {
      ...body,
      visitDate: new Date(body.visitDate),
    };

    await updateMedicalRecord(id, updatedBody);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating medical record:", error);
    return NextResponse.json(
      { error: "Failed to update medical record" },
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
    await deleteMedicalRecord(id);
    if (global.broadcastUpdate) {
      console.log("broadcasting");
      global.broadcastUpdate("medical_records", {
        action: "create",
        data: "record created",
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return NextResponse.json(
      { error: "Failed to delete medical record" },
      { status: 500 }
    );
  }
}
