import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicalRecordsTableSkeletonProps {
  rows: number;
  showPatient?: boolean;
}

export function MedicalRecordsTableSkeleton({
  rows,
  showPatient = true,
}: MedicalRecordsTableSkeletonProps) {
  return (
    <>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <TableRow key={index}>
            {showPatient && (
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
            )}
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
