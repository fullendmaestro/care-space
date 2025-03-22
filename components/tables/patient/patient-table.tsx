"use client";

import { useState, useEffect, useRef } from "react";
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
import { SearchFilter } from "@/components/tables/search-filter";
import { PatientTableSkeleton } from "@/components/tables/patient/patient-table-skeleton";
import type { PatientData } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import { Pagination } from "@/components/tables/pagination";
import { PatientRow } from "@/components/tables/patient/patient-row";
import { PatientUpdateModal } from "@/components/tables/patient/patient-update-modal";
import { PatientDeleteModal } from "@/components/tables/patient/patient-delete-modal";
import { useSocket } from "@/hooks/useSocket";
import { socketPath } from "@/const";

interface PatientsTableProps {
  data: PatientData[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  pageSize: number;
  onRefresh?: () => void;
}

export function PatientsTable({
  data,
  isLoading,
  totalItems,
  currentPage,
  onPageChange,
  onSearch,
  searchQuery,
  pageSize,
  onRefresh,
}: PatientsTableProps) {
  useSocket({
    url: socketPath,
    channel: "patients",
    onMessage: () => {
      if (onRefresh) onRefresh();
    },
    shouldReconnect: () => true,
  });

  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleUpdatePatient = async (formData: any) => {
    if (!selectedPatient) return;

    try {
      await axios.put(`/api/patients/${selectedPatient.id}`, formData);
      toast.success("Patient updated successfully");
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to update patient");
      console.error(error);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    try {
      await axios.delete(`/api/patients/${selectedPatient.id}`);
      toast.success("Patient deleted successfully");
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete patient");
      console.error(error);
    }
  };

  const handleRowClick = (patient: PatientData) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <Card className="max-w-[1260px] mx-auto">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>Manage your patient records</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
            <SearchFilter value={searchQuery} onChange={onSearch} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Patient ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <PatientTableSkeleton rows={5} />
              ) : data.length > 0 ? (
                data.map((patient) => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    onClick={() => handleRowClick(patient)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No patients found
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

      <PatientUpdateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patient={selectedPatient}
        onUpdate={handleUpdatePatient}
        onDelete={() => setIsDeleteModalOpen(true)}
        router={router}
      />

      <PatientDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        patient={selectedPatient}
        onDelete={handleDeletePatient}
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
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>Manage your patient records</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Patient ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <PatientTableSkeleton rows={5} />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
