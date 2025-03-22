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
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AddStaffForm } from "@/components/forms/add-staff-form";
import { SearchFilter } from "@/components/tables/search-filter";
import { StaffTableSkeleton } from "@/components/tables/staff/staff-table-skeleton";
import { Pagination } from "@/components/tables/pagination";
import { StaffRow } from "@/components/tables/staff/staff-row";
import { UpdateStaffModal } from "@/components/tables/staff/staff-update-modal";
import { StaffDeleteModal } from "@/components/tables/staff/staff-delete-modal";
import axios from "axios";
import { toast } from "sonner";
import { Staff } from "@/types";
import useWebSocket from "react-use-websocket";

interface StaffTableProps {
  data: Staff[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  pageSize: number;
  onRefresh?: () => void;
}

export function StaffTable({
  data,
  isLoading,
  totalItems,
  currentPage,
  onPageChange,
  onSearch,
  searchQuery,
  pageSize,
  onRefresh,
}: StaffTableProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const totalPages = Math.ceil(totalItems / pageSize);

  const { sendJsonMessage } = useWebSocket("ws://localhost:3000", {
    onOpen: () => {
      console.log("WebSocket connected");
      sendJsonMessage({ type: "subscribe", channel: "staff" });
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "update" && message.channel === "staff") {
        console.log("Received update for staff:", message.data);
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
      sendJsonMessage({ type: "unsubscribe", channel: "staff" });
    };
  }, [sendJsonMessage]);

  const handleAddStaff = async (formData: any) => {
    try {
      await axios.post("/api/staff", formData);
      toast.success("Staff member added successfully");
      setIsAddModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to add staff member");
      console.error(error);
    }
  };

  const handleUpdateStaff = async (formData: any) => {
    if (!selectedStaff) return;

    try {
      await axios.put(`/api/staff/${selectedStaff.id}`, formData);
      toast.success("Staff member updated successfully");
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to update staff member");
      console.error(error);
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      await axios.delete(`/api/staff/${selectedStaff.id}`);
      toast.success("Staff member deleted successfully");
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete staff member");
      console.error(error);
    }
  };

  const handleRowClick = (staff: Staff) => {
    setSelectedStaff(staff);
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
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>Manage your staff members</CardDescription>
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
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <StaffTableSkeleton rows={5} />
              ) : data.length > 0 ? (
                data.map((staff) => (
                  <StaffRow
                    key={staff.id}
                    staff={staff}
                    onClick={() => handleRowClick(staff)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No staff members found
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

      <Modal
        title="Add New Staff Member"
        description="Enter the staff details below to add a new staff record."
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AddStaffForm onSubmit={handleAddStaff} />
      </Modal>

      <UpdateStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staff={selectedStaff}
        onUpdate={handleUpdateStaff}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      <StaffDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        staff={selectedStaff}
        onDelete={handleDeleteStaff}
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
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>Manage your staff members</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <StaffTableSkeleton rows={5} />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
