import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { StaffDashboard } from "@/components/staff/staff";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session?.user.role !== "doctor" && session?.user.role !== "nurse") {
    redirect("/");
  }

  return <StaffDashboard session={session} />;
}
