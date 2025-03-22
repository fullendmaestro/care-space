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
import {
  getDoctorAppointments,
  getDoctorTodaysAppointments,
} from "@/app/(staff)/actions";
import { DoctorAddRecordModal } from "./staff-add-record-modal";

interface StaffAppointmentsProps {
  staffId: string;
  limit?: number;
  today?: boolean;
  showViewAll?: boolean;
}

export function StaffAppointments({
  staffId,
  today = false,
}: StaffAppointmentsProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (today) {
          const todaysAppointments = await getDoctorTodaysAppointments(staffId);
          setAppointments(todaysAppointments);
        } else if (!today) {
          const allAppointments = await getDoctorAppointments(staffId);
          setAppointments(allAppointments);
        }
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
  }, [staffId, today]);

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
                  <DoctorAddRecordModal
                    patientId={appointment.patientId}
                    doctorId={staffId}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
