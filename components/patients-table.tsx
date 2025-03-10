import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PatientRow from "@/components/patient";
import { Patient } from "@/app/(dashboard)/tapi/patients/route";
import { Skeleton } from "./ui/skeleton";

interface PatientsTableProps {
  data: Patient[] | undefined;
}

export default function PatientsTable({ data }: PatientsTableProps) {
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
          {data?.map((patient) => (
            <PatientRow key={patient.id} patient={patient} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Table skeleton component for loading state
export function TableSkeleton() {
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
