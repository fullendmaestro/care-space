import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PatientRow from "@/components/patient";
import { Patient } from "@/app/(dashboard)/api/patients/route";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/pagination";

interface PatientsTableProps {
  data: Patient[] | undefined;
  page: number;
  totalPages: number;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

export default function PatientsTable({
  data,
  page,
  totalPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
}: PatientsTableProps) {
  return (
    <div className="">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="admitted">Admitted</TabsTrigger>
          <TabsTrigger value="discharged">Discharged</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="stable">Stable</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
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
          <Pagination
            page={page}
            totalPages={totalPages}
            onFirstPage={onFirstPage}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onLastPage={onLastPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Table skeleton component for loading state
export function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm max-w-6xl mx-auto">
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
