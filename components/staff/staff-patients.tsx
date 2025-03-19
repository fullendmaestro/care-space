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
import { FileText, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
        // Get patients who have appointments with this staff member
        const response = await axios.get(
          `/api/patients/by-doctor?doctorId=${staffId}&limit=${limit}`
        );
        setPatients(response.data);
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
              {patient.age} • {patient.gender}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/staff/medical-records/create?patientId=${patient.id}&patientName=${patient.name}`
                    )
                  }
                >
                  <FileText className="mr-1 h-4 w-4" />
                  Add Record
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/staff/appointments/schedule?patientId=${patient.id}&patientName=${patient.name}`
                    )
                  }
                >
                  <Calendar className="mr-1 h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
