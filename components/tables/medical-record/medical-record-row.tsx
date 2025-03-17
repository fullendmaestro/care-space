import { TableRow, TableCell } from "@/components/ui/table";

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  visitDate: string;
}

interface MedicalRecordRowProps {
  record: MedicalRecord;
  onClick: () => void;
  showPatient: boolean;
}

export function MedicalRecordRow({
  record,
  onClick,
  showPatient,
}: MedicalRecordRowProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <TableRow className="cursor-pointer hover:bg-gray-50" onClick={onClick}>
      {showPatient && (
        <TableCell className="px-4 py-3">{record.patientName}</TableCell>
      )}
      <TableCell className="px-4 py-3">
        {formatDate(record.visitDate)}
      </TableCell>
      <TableCell className="px-4 py-3">{record.doctorName}</TableCell>
      <TableCell className="px-4 py-3 max-w-[200px] truncate">
        {record.diagnosis}
      </TableCell>
      <TableCell className="px-4 py-3 max-w-[200px] truncate">
        {record.treatment}
      </TableCell>
    </TableRow>
  );
}
