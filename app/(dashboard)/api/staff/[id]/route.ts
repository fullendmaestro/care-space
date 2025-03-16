import { NextResponse } from "next/server"
import { getStaffById, updateStaff, deleteStaff } from "@/lib/db/queries"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const staff = await getStaffById(params.id)
    if (!staff || staff.length === 0) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
    }
    return NextResponse.json(staff[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff member" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    await updateStaff(params.id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteStaff(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 })
  }
}

