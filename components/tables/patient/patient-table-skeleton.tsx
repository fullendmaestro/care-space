import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientTableSkeletonProps {
  rows: number;
}

export function PatientTableSkeleton({ rows }: PatientTableSkeletonProps) {
  return (
    <>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <TableRow key={index}>
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
    </>
  );
}
