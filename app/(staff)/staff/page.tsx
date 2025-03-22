import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { StaffDashboard } from "@/components/staff/staff";
import { getStaffProfile } from "@/app/(staff)/actions";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session?.user.role !== "doctor" && session?.user.role !== "nurse") {
    redirect("/");
  }

  if (session.user.email) {
    const staff = await getStaffProfile(session.user.email);
    return <StaffDashboard session={session} staff={staff} />;
  }
}
