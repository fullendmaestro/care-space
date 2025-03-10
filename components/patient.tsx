import { TableCell, TableRow } from "@/components/ui/table";
import { Patient } from "@/app/(dashboard)/api/patients/route";

interface PatientRowProps {
  patient: Patient;
}

export default function PatientRow({ patient }: PatientRowProps) {
  return (
    <TableRow key={patient.id} className="hover:bg-gray-50">
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={patient.image}
            alt={`${patient.name}'s avatar`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-gray-400 text-xs">{patient.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        {patient.age} • {patient.gender}
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
      <TableCell className="px-4 py-3">{patient.department}</TableCell>
      <TableCell className="px-4 py-3">{patient.doctor}</TableCell>
      <TableCell className="px-4 py-3">{patient.lastVisit}</TableCell>
    </TableRow>
  );
}
