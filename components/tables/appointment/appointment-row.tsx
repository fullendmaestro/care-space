import { TableRow, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
}

interface AppointmentRowProps {
  appointment: Appointment;
  onClick: () => void;
}

export function AppointmentRow({ appointment, onClick }: AppointmentRowProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <TableRow
      key={appointment.id}
      className="cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <TableCell className="px-4 py-3">{appointment.patientName}</TableCell>
      <TableCell className="px-4 py-3">{appointment.doctorName}</TableCell>
      <TableCell className="px-4 py-3">
        {formatDate(appointment.appointmentDate)}
      </TableCell>
      <TableCell className="px-4 py-3">
        {appointment.startTime} - {appointment.endTime}
      </TableCell>
      <TableCell className="px-4 py-3">
        <StatusBadge status={appointment.status} />
      </TableCell>
      <TableCell className="px-4 py-3 max-w-[200px] truncate">
        {appointment.reason}
      </TableCell>
    </TableRow>
  );
}
