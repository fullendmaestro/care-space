import { TableCell, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface StaffTableSkeletonProps {
  rows: number
}

export function StaffTableSkeleton({ rows }: StaffTableSkeletonProps) {
  return (
    <>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="px-4 py-3">
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
          </TableRow>
        ))}
    </>
  )
}

