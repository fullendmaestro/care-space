"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPatientsByStaff } from "@/app/(staff)/actions"; // Import the new action
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
import { FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DoctorAddRecordModal } from "./staff-add-record-modal";

interface StaffPatientsProps {
  staffId: string;
  limit?: number;
}

export function StaffPatients({ staffId, limit = 5 }: StaffPatientsProps) {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatientsByStaff(staffId, limit); // Use the new action
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    if (staffId) {
      fetchPatients();
    }
  }, [staffId, limit]);

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

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No patients found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Age/Gender</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <img
                  src={patient.image || "/placeholder.svg?height=32&width=32"}
                  alt={patient.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {patient.patientId}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={patient.status} />
            </TableCell>
            <TableCell>
              {patient.age} •{" "}
              <span className="capitalize">{patient.gender}</span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <DoctorAddRecordModal
                  patientId={patient.id}
                  doctorId={staffId}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
