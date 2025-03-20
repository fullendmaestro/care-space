import { NextResponse } from "next/server";
import { getStaffById, updateStaff, deleteStaff } from "@/lib/db/queries";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    const staff = await getStaffById(id);
    if (!staff || staff.length === 0) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(staff[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff member" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const id = params.id;
    const body = await request.json();
    await updateStaff(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update staff member" },
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
    await deleteStaff(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete staff member" },
      { status: 500 }
    );
  }
}
