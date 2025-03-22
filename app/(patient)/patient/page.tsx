import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { PatientDashboardClient } from "@/components/patient/patient";
import { getPatientProfile } from "@/app/(patient)/action";

export default async function PatientDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session?.user.role !== "patient") {
    redirect("/");
  }

  if (session.user.email) {
    const patient = await getPatientProfile(session.user.email);
    return <PatientDashboardClient session={session} patient={patient} />;
  }
  return redirect("/");
}
