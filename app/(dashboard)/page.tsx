"use client";
import { useState } from "react";
import PatientsTable, {
  TableSkeleton,
} from "@/components/tables/patient/patients-table";
import usePatients from "@/hooks/usePatients";

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isError } = usePatients(page);

  const totalPages = 4; // Assuming there are 4 pages of data for simplicity

  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleFirstPage = () => setPage(1);
  const handleLastPage = () => setPage(totalPages);

  if (isLoading)
    return (
      <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-2xl font-bold mb-6">Patient Records</h1>
        <TableSkeleton />
      </div>
    );

  if (isError) return <p> Error: {(error as Error).message}</p>;

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold mb-6">Patient Records</h1>
      <PatientsTable
        data={data}
        page={page}
        totalPages={totalPages}
        onFirstPage={handleFirstPage}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onLastPage={handleLastPage}
      />
    </div>
  );
}
