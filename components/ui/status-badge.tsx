import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "discharged":
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "critical":
      case "cancelled":
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-200"
      case "stable":
      case "in progress":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "admitted":
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        getStatusColor(status),
        className,
      )}
    >
      {status}
    </span>
  )
}

