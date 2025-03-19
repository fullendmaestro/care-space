"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PatientAppointments } from "@/components/patient/patient-appointments";
import { PatientMedicalRecords } from "@/components/patient/patient-medical-records";
import { PatientInfoCard } from "@/components/patient/patient-info-card";
import { PatientAppointmentScheduleModal } from "@/components/patient/patient-appointment-schedule-modal";
import axios from "axios";
import { toast } from "sonner";

export default function PatientDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // First get the patient ID from the user's email
        const userResponse = await axios.get(
          `/api/patients/by-email?email=${session?.user?.email}`
        );
        if (userResponse.data && userResponse.data.id) {
          setPatient(userResponse.data);
        } else {
          toast.error("Patient profile not found");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to load patient data");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchPatientData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading patient profile...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Patient Profile Not Found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find your patient profile.
        </p>
        <Button onClick={() => router.push("/login")}>Return to Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {patient.name}</h1>
        <StatusBadge status={patient.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PatientInfoCard patient={patient} />

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsScheduleModalOpen(true)}>
                  Schedule New Appointment
                </Button>
              </div>
              <PatientAppointments patientId={patient.id} showUpcoming={true} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="medical-records">
        <TabsList>
          <TabsTrigger value="medical-records">
            Recent Medical Records
          </TabsTrigger>
          <TabsTrigger value="appointments">All Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="medical-records">
          <Card>
            <CardHeader>
              <CardTitle>Your Medical Records</CardTitle>
              <CardDescription>
                Recent medical history and treatments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientMedicalRecords
                patientId={patient.id}
                limit={5}
                showViewAll={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>
                Your appointment history and upcoming visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientAppointments
                patientId={patient.id}
                showUpcoming={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PatientAppointmentScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        patientId={patient.id} // Pass the logged-in patient's ID
        onRefresh={() => {
          // Optional: Add logic to refresh appointments if needed
        }}
      />
    </div>
  );
}
