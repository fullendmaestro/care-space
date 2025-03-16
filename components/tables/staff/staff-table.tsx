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
import { AddStaffForm } from "@/components/forms/add-staff-form";
import { SearchFilter } from "@/components/tables/search-filter";
import { StaffTableSkeleton } from "@/components/tables/staff/staff-table-skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  contactNumber: string;
  email: string;
  isActive: boolean;
  image?: string;
  details?: any;
}

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const totalPages = Math.ceil(totalItems / pageSize);

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
                  <TableRow
                    key={staff.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(staff)}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            staff.image || "/placeholder.svg?height=40&width=40"
                          }
                          alt={`${staff.name}'s avatar`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="font-medium">{staff.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="capitalize">{staff.role}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {staff.specialization || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {staff.contactNumber || staff.email}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge
                        status={staff.isActive ? "Active" : "Inactive"}
                      />
                    </TableCell>
                  </TableRow>
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
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
              entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Staff Modal */}
      <Modal
        title="Edit Staff Member"
        description="Update staff information or delete staff record."
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleDeleteStaff}
        confirmText="Delete Staff Member"
      >
        {selectedStaff && (
          <AddStaffForm
            onSubmit={handleUpdateStaff}
            initialData={selectedStaff}
          />
        )}
      </Modal>
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
