"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PatientsTable } from "@/components/tables/patient/patient-table";
import usePatients from "@/hooks/usePatients";

export default function PatientsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading, refetch } = usePatients(
    page,
    search,
    activeStatus,
    pageSize
  );

  const handleDeletePatient = async (id: string) => {
    try {
      await axios.delete(`/api/patients/${id}`);
      toast.success("Patient deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete patient");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Management</h1>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveStatus}>
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="Admitted" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            Admitted
          </TabsTrigger>
          <TabsTrigger value="Critical" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            Critical
          </TabsTrigger>
          <TabsTrigger value="Stable" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
            Stable
          </TabsTrigger>
          <TabsTrigger value="Discharged" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            Discharged
          </TabsTrigger>
          <TabsTrigger value="Scheduled" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            Scheduled
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeStatus}>
          <PatientsTable
            data={data?.data || []}
            isLoading={isLoading}
            totalItems={data?.totalItems || 0}
            currentPage={page}
            onPageChange={setPage}
            searchQuery={search}
            onSearch={setSearch}
            pageSize={pageSize}
            onRefresh={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
