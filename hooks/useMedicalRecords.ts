import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

async function fetchMedicalRecords(
  page: number,
  search: string,
  pageSize: number,
  patientId?: string
): Promise<{ data: MedicalRecord[]; totalItems: number }> {
  const response = await axios.get(
    `/api/medical-records?page=${page}&limit=${pageSize}&search=${search}${
      patientId ? `&patientId=${patientId}` : ""
    }`
  );
  return {
    data: response.data,
    totalItems: Number.parseInt(response.headers["x-total-count"] || "0"),
  };
}

export default function useMedicalRecords(
  page: number,
  search: string,
  pageSize: number,
  patientId?: string
) {
  return useQuery({
    queryKey: ["medical-records", page, search, pageSize, patientId],
    queryFn: () => fetchMedicalRecords(page, search, pageSize, patientId),
  });
}
