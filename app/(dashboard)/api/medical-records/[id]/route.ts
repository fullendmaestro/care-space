import { NextResponse } from "next/server";
import {
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "@/lib/db/queries";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const medicalRecord = await getMedicalRecordById(params.id);
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedBody = {
      ...body,
      visitDate: new Date(body.visitDate),
    };

    await updateMedicalRecord(params.id, updatedBody);
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
  { params }: { params: { id: string } }
) {
  try {
    await deleteMedicalRecord(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return NextResponse.json(
      { error: "Failed to delete medical record" },
      { status: 500 }
    );
  }
}
