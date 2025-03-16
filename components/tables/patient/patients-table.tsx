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

interface PatientsTableProps {
  data: PatientData[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  pageSize: number;
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
}: PatientsTableProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const totalPages = Math.ceil(totalItems / pageSize);

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
                  <PatientRow key={patient.id} patient={patient} />
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
    </Card>
  );
}
