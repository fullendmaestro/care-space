import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentsTableSkeletonProps {
  rows: number;
}

export function AppointmentsTableSkeleton({
  rows,
}: AppointmentsTableSkeletonProps) {
  return (
    <>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-6 w-[80px] rounded-full" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
