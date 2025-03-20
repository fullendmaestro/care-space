"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AppointmentsTable,
  TableSkeleton,
} from "@/components/tables/appointment/appointment-table";
import useAppointments from "@/hooks/useAppointments";

export default function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading, refetch } = useAppointments(
    page,
    search,
    activeStatus,
    pageSize
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointment Management</h1>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveStatus}>
        <TabsList>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
          <TabsTrigger value="Scheduled" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="Completed" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            Completed
          </TabsTrigger>
          <TabsTrigger value="Cancelled" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            Cancelled
          </TabsTrigger>
          <TabsTrigger value="In Progress" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
            In Progress
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeStatus}>
          <AppointmentsTable
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
