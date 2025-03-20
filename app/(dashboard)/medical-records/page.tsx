"use client";

import { useState } from "react";
import {
  MedicalRecordsTable,
  TableSkeleton,
} from "@/components/tables/medical-record/medical-record-table";
import useMedicalRecords from "@/hooks/useMedicalRecords";

export default function MedicalRecordsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading, refetch } = useMedicalRecords(
    page,
    search,
    pageSize
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medical Records</h1>
      </div>

      <MedicalRecordsTable
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
    </div>
  );
}
