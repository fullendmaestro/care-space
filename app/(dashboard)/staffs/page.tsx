"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  StaffTable,
  TableSkeleton,
} from "@/components/tables/staff/staff-table";
import useStaff from "@/hooks/useStaff";

export default function StaffPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("all");
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading, refetch } = useStaff(
    page,
    search,
    activeRole,
    pageSize
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Management</h1>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveRole}>
        <TabsList>
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="doctor">Doctors</TabsTrigger>
          <TabsTrigger value="nurse">Nurses</TabsTrigger>
          <TabsTrigger value="receptionist">Receptionists</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
        </TabsList>
        <TabsContent value={activeRole}>
          <StaffTable
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
