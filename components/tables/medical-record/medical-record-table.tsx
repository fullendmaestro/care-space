"use client";

import { useEffect, useState, useRef } from "react";
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
import { SearchFilter } from "@/components/tables/search-filter";
import { MedicalRecordsTableSkeleton } from "@/components/tables/medical-record/medical-record-table-skeleton";
import { FileText } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Pagination } from "@/components/tables/pagination";
import { MedicalRecordRow } from "@/components/tables/medical-record/medical-record-row";
import { MedicalRecordAddModal } from "@/components/tables/medical-record/medical-record-add-modal";
import { MedicalRecordEditModal } from "@/components/tables/medical-record/medical-record-edit-modal";
import useWebSocket from "react-use-websocket";

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  visitDate: string;
}

interface MedicalRecordsTableProps {
  data: MedicalRecord[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  pageSize: number;
  onRefresh?: () => void;
  patientId?: string;
}

export function MedicalRecordsTable({
  data,
  isLoading,
  totalItems,
  currentPage,
  onPageChange,
  onSearch,
  searchQuery,
  pageSize,
  onRefresh,
  patientId,
}: MedicalRecordsTableProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const totalPages = Math.ceil(totalItems / pageSize);

  const { sendJsonMessage } = useWebSocket("ws://localhost:3000", {
    onOpen: () => {
      console.log("WebSocket connected");
      sendJsonMessage({ type: "subscribe", channel: "medical_records" });
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      if (message.channel === "medical_records") {
        console.log("Received update for medical records:", message.data);
        if (onRefresh) onRefresh();
      }
    },
    onClose: () => {
      console.log("WebSocket disconnected");
    },
    shouldReconnect: () => true,
  });

  useEffect(() => {
    return () => {
      sendJsonMessage({ type: "unsubscribe", channel: "medical_records" });
    };
  }, [sendJsonMessage]);

  const handleAddRecord = async (formData: any) => {
    try {
      await axios.post("/api/medical-records", formData);
      toast.success("Medical record added successfully");
      setIsAddModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to add medical record");
      console.error(error);
    }
  };

  const handleUpdateRecord = async (formData: any) => {
    if (!selectedRecord) return;

    try {
      await axios.put(`/api/medical-records/${selectedRecord.id}`, formData);
      toast.success("Medical record updated successfully");
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to update medical record");
      console.error(error);
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;

    try {
      await axios.delete(`/api/medical-records/${selectedRecord.id}`);
      toast.success("Medical record deleted successfully");
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete medical record");
      console.error(error);
    }
  };

  const handleRowClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              {patientId
                ? "Patient's medical history"
                : "Manage patient medical records"}
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
            <SearchFilter value={searchQuery} onChange={onSearch} />
            <Button onClick={() => setIsAddModalOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {!patientId && <TableHead>Patient</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <MedicalRecordsTableSkeleton
                  rows={5}
                  showPatient={!patientId}
                />
              ) : data.length > 0 ? (
                data.map((record) => (
                  <MedicalRecordRow
                    key={record.id}
                    record={record}
                    onClick={() => handleRowClick(record)}
                    showPatient={!patientId}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={patientId ? 4 : 5}
                    className="h-24 text-center"
                  >
                    No medical records found
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

      <MedicalRecordAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRecord}
      />

      <MedicalRecordEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateRecord}
        onDelete={handleDeleteRecord}
        record={selectedRecord}
        patientId={patientId}
      />
    </Card>
  );
}

export function TableSkeleton({ patientId }: { patientId?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              {patientId
                ? "Patient's medical history"
                : "Manage patient medical records"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {!patientId && <TableHead>Patient</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <MedicalRecordsTableSkeleton rows={5} showPatient={!patientId} />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
