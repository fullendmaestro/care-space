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
import { StaffInfoCard } from "@/components/staff/staff-info-card";
import { StaffAppointments } from "@/components/staff/staff-appointments";
import { StaffPatients } from "@/components/staff/staff-patients";
import { StaffSchedule } from "@/components/staff/staff-schedule";
import axios from "axios";
import { toast } from "sonner";

export default function StaffDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        // First get the staff ID from the user's email
        const staffResponse = await axios.get(
          `/api/staff/by-email?email=${session?.user?.email}`
        );
        console.log("fetched staff user", staffResponse);
        if (staffResponse.data && staffResponse.data.id) {
          setStaff(staffResponse.data);
        } else {
          toast.error("Staff profile not found");
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        toast.error("Failed to load staff data");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchStaffData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading staff profile...
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Staff Profile Not Found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find your staff profile.
        </p>
        <Button onClick={() => router.push("/login")}>Return to Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {staff.name}</h1>
        <StatusBadge status={staff.isActive ? "Active" : "Inactive"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StaffInfoCard staff={staff} />

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              Your scheduled appointments for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StaffAppointments
              staffId={staff.id}
              limit={5}
              today={true}
              showViewAll={true}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients">
        <TabsList>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="appointments">All Appointments</TabsTrigger>
          {staff.role === "doctor" && (
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="patients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Patients</CardTitle>
                <CardDescription>Patients under your care</CardDescription>
              </div>
              <Button onClick={() => router.push("/staff/patients")}>
                View All Patients
              </Button>
            </CardHeader>
            <CardContent>
              <StaffPatients staffId={staff.id} limit={5} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>
                  Your upcoming and past appointments
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/staff/appointments")}>
                Manage Appointments
              </Button>
            </CardHeader>
            <CardContent>
              <StaffAppointments staffId={staff.id} limit={10} />
            </CardContent>
          </Card>
        </TabsContent>
        {staff.role === "doctor" && (
          <TabsContent value="schedule">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Schedule</CardTitle>
                  <CardDescription>Your weekly working hours</CardDescription>
                </div>
                <Button onClick={() => router.push("/staff/schedule")}>
                  Manage Schedule
                </Button>
              </CardHeader>
              <CardContent>
                <StaffSchedule doctorId={staff.id} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
