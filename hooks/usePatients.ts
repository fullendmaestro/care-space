import { PatientData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchPatients(
  page: number,
  search: string,
  activeStatus: string,
  pageSize: number
): Promise<{ data: PatientData[]; totalItems: number }> {
  const status = activeStatus !== "all" ? activeStatus : undefined;
  const response = await axios.get(
    `/api/patients?page=${page}&limit=${pageSize}&search=${search}${
      status ? `&status=${status}` : ""
    }`
  );
  return {
    data: response.data,
    totalItems: Number.parseInt(response.headers["x-total-count"] || "0"),
  };
}

export default function usePatients(
  page: number,
  search: string,
  activeStatus: string,
  pageSize: number
) {
  return useQuery({
    queryKey: ["patients", page, search, activeStatus, pageSize],
    queryFn: () => fetchPatients(page, search, activeStatus, pageSize),
  });
}
