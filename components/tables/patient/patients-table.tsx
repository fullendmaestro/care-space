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
import Pagination from "@/components/tables/pagination";
import { SearchFilter } from "@/components/tables/search-filter";
import PatientRow from "@/components/tables/patient/patient";
import { PatientTableSkeleton } from "@/components/tables/patient/patient-table-skeleton";
import { Edit, Eye, Trash2, UserPlus } from "lucide-react";
import { PatientData } from "@/types";
import { Modal } from "@/components/ui/modal";
import { AddPatientForm } from "@/components/forms/add-patient-form";
import axios from "axios";
import { toast } from "sonner";

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
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  return (
    <Card>
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
                <TableHead>Department</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Last Visit</TableHead>
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
                  <TableCell colSpan={7} className="h-24 text-center">
                    No patients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onFirstPage={() => onPageChange(1)}
            onPrevPage={() => onPageChange(currentPage - 1)}
            onNextPage={() => onPageChange(currentPage + 1)}
            onLastPage={() => onPageChange(totalPages)}
          />
        </div>
      </CardContent>
      {/* Edit Patient Modal */}
      <Modal
        title="Edit Patient"
        description="Update patient information or delete patient record."
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleDeletePatient}
        confirmText="Delete Patient"
      >
        {selectedPatient && (
          <AddPatientForm
            onSubmit={handleUpdatePatient}
            initialData={selectedPatient}
          />
        )}
      </Modal>
    </Card>
  );
}
