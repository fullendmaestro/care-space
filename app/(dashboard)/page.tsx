"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Patient } from "./tapi/patients/route";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function fetchPosts(page: number): Promise<Patient[]> {
  const response = await fetch(`/tapi/patients?page=${page}`);
  return response.json();
}

// Table skeleton component for loading state
function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table className="w-full border-collapse bg-white text-sm">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
              Patient
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
              Age/Gender
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
              Status
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
              Department
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
              Doctor
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
              Last Visit
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["patients", page],
    queryFn: () => fetchPosts(page),
  });

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

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
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table className="w-full border-collapse bg-white text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
                Patient
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
                Age/Gender
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
                Department
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
                Doctor
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-gray-500">
                Last Visit
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {data?.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.image}
                      alt={`${patient.name}'s avatar`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-gray-400 text-xs">{patient.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {patient.age} • {patient.gender}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === "Admitted"
                        ? "bg-blue-100 text-blue-800"
                        : patient.status === "Discharged"
                        ? "bg-green-100 text-green-800"
                        : patient.status === "Critical"
                        ? "bg-red-100 text-red-800"
                        : patient.status === "Stable"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {patient.department}
                </TableCell>
                <TableCell className="px-4 py-3">{patient.doctor}</TableCell>
                <TableCell className="px-4 py-3">{patient.lastVisit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
