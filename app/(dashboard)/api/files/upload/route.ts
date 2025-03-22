import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("requesting upl");
  const form = await request.formData();
  const file = form.get("file") as File;
  console.log("file", file);
  const blob = await put(file.name, file, { access: "public" });

  console.log("blob", blob);

  return NextResponse.json(blob);
}
