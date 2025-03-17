"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AddAppointmentForm } from "@/components/forms/add-appointment-form";
import { SearchFilter } from "@/components/tables/search-filter";
import { AppointmentsTableSkeleton } from "@/components/tables/appointment/appointment-table-skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/tables/pagination";
import { AppointmentRow } from "@/components/tables/appointment/appointment-row";
import { AppointmentScheduleModal } from "@/components/tables/appointment/appointment-schedule-modal";
import { AppointmentEditModal } from "@/components/tables/appointment/appointment-edit-modal";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
}

interface AppointmentsTableProps {
  data: Appointment[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  pageSize: number;
  onRefresh?: () => void;
}

export function AppointmentsTable({
  data,
  isLoading,
  totalItems,
  currentPage,
  onPageChange,
  onSearch,
  searchQuery,
  pageSize,
  onRefresh,
}: AppointmentsTableProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleAddAppointment = async (formData: any) => {
    try {
      await axios.post("/api/appointments", formData);
      toast.success("Appointment added successfully");
      setIsAddModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to add appointment");
      console.error(error);
    }
  };

  const handleUpdateAppointment = async (formData: any) => {
    if (!selectedAppointment) return;

    try {
      await axios.put(`/api/appointments/${selectedAppointment.id}`, formData);
      toast.success("Appointment updated successfully");
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to update appointment");
      console.error(error);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await axios.delete(`/api/appointments/${selectedAppointment.id}`);
      toast.success("Appointment deleted successfully");
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete appointment");
      console.error(error);
    }
  };

  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage patient appointments</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
            <SearchFilter value={searchQuery} onChange={onSearch} />
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <AppointmentsTableSkeleton rows={5} />
              ) : data.length > 0 ? (
                data.map((appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    onClick={() => handleRowClick(appointment)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            totalItems={totalItems}
          />
        )}
      </CardContent>

      <AppointmentScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAppointment}
      />

      <AppointmentEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        appointment={selectedAppointment}
        onUpdate={handleUpdateAppointment}
        onDelete={handleDeleteAppointment}
      />
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage patient appointments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AppointmentsTableSkeleton rows={5} />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
