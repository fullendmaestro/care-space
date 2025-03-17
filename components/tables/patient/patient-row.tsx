import { TableCell, TableRow } from "@/components/ui/table";
import type { PatientData } from "@/types";

interface PatientRowProps {
  patient: PatientData;
  onClick: () => void;
}

export function PatientRow({ patient, onClick }: PatientRowProps) {
  return (
    <TableRow
      key={patient.id}
      className="cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={patient.image || "/placeholder.svg?height=40&width=40"}
            alt={`${patient.name}'s avatar`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-gray-400 text-xs">{patient.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        {patient.details.age || "N/A"} •{" "}
        {patient.details.gender
          ? patient.details.gender.charAt(0).toUpperCase() +
            patient.details.gender.slice(1)
          : "N/A"}
      </TableCell>
      <TableCell className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            patient.status === "Admitted"
              ? "bg-blue-100 text-blue-800"
              : patient.status === "Discharged"
              ? "bg-green-100 text-green-800"
              : patient.status === "Critical"
              ? "bg-red-100 text-red-800"
              : patient.status === "Stable"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {patient.status}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        {patient.details.contactNumber || "N/A"}
      </TableCell>
      <TableCell className="px-4 py-3">
        {patient.details.bloodGroup || "N/A"}
      </TableCell>
      <TableCell className="px-4 py-3">{patient.patientId}</TableCell>
    </TableRow>
  );
}
