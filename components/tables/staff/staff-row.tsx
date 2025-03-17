import { TableRow, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";

interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  contactNumber: string;
  email: string;
  isActive: boolean;
  image?: string;
  details?: any;
}

interface StaffRowProps {
  staff: Staff;
  onClick: () => void;
}

export function StaffRow({ staff, onClick }: StaffRowProps) {
  return (
    <TableRow
      key={staff.id}
      className="cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={staff.image || "/placeholder.svg?height=40&width=40"}
            alt={`${staff.name}'s avatar`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="font-medium">{staff.name}</div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <span className="capitalize">{staff.role}</span>
      </TableCell>
      <TableCell className="px-4 py-3">
        {staff.details.specialization || "N/A"}
      </TableCell>
      <TableCell className="px-4 py-3">
        {staff.contactNumber || staff.email}
      </TableCell>
      <TableCell className="px-4 py-3">
        <StatusBadge status={staff.isActive ? "Active" : "Inactive"} />
      </TableCell>
    </TableRow>
  );
}
