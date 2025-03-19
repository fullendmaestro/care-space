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
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";

interface PatientMedicalRecordsProps {
  patientId: string;
  limit?: number;
  showViewAll?: boolean;
}

export function PatientMedicalRecords({
  patientId,
}: PatientMedicalRecordsProps) {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get(
          `/api/medical-records/by-pid?patientId=${patientId}`
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        toast.error("Failed to load medical records");
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchMedicalRecords();
    }
  }, [patientId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No medical records found
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Treatment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{formatDate(record.visitDate)}</TableCell>
              <TableCell>{record.doctorName}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {record.diagnosis}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {record.treatment}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
