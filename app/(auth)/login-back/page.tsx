import { redirect } from "next/navigation";
import { auth } from "../auth";

export default async function Home() {
  const session = await auth();
  console.log("sessionn", session);
  if (session?.user.role === "patient") {
    redirect("/patient");
  } else if (session?.user.role === "doctor" || "nurse" || "receptionist") {
    redirect("/staff");
  } else if (session?.user.role === "admin") {
    redirect("/patients");
  }
  return redirect("/login");
}
//
