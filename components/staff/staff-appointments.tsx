"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";

interface StaffAppointmentsProps {
  staffId: string;
  limit?: number;
  today?: boolean;
  showViewAll?: boolean;
}

export function StaffAppointments({
  staffId,
  limit = 5,
  today = false,
  showViewAll = false,
}: StaffAppointmentsProps) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let url = `/api/appointments?doctorId=${staffId}&limit=${limit}`;

        if (today) {
          const todayDate = new Date().toISOString().split("T")[0];
          url += `&date=${todayDate}`;
        }

        const response = await axios.get(url);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    if (staffId) {
      fetchAppointments();
    }
  }, [staffId, limit, today]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status });

      // Update the local state
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast.success("Appointment status updated");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {today
          ? "No appointments scheduled for today"
          : "No appointments found"}
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
              <TableCell>
                {appointment.startTime} - {appointment.endTime}
              </TableCell>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>
                <StatusBadge status={appointment.status} />
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {appointment.reason}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {appointment.status === "Scheduled" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(appointment.id, "Completed")
                        }
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() =>
                          handleUpdateStatus(appointment.id, "Cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/staff/medical-records/create?patientId=${appointment.patientId}&patientName=${appointment.patientName}`
                      )
                    }
                  >
                    Add Record
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showViewAll && appointments.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => router.push("/staff/appointments")}
          >
            View All Appointments
          </Button>
        </div>
      )}
    </div>
  );
}
