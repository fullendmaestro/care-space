import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

async function fetchAppointments(
  page: number,
  search: string,
  status: string,
  pageSize: number,
  doctorId?: string,
  patientId?: string,
  date?: string
): Promise<{ data: Appointment[]; totalItems: number }> {
  const statusParam = status !== "all" ? status : undefined;
  let url = `/api/appointments?page=${page}&limit=${pageSize}&search=${search}`;

  if (statusParam) url += `&status=${statusParam}`;
  if (doctorId) url += `&doctorId=${doctorId}`;
  if (patientId) url += `&patientId=${patientId}`;
  if (date) url += `&date=${date}`;

  const response = await axios.get(url);
  return {
    data: response.data,
    totalItems: Number.parseInt(response.headers["x-total-count"] || "0"),
  };
}

export default function useAppointments(
  page: number,
  search: string,
  status: string,
  pageSize: number,
  doctorId?: string,
  patientId?: string,
  date?: string
) {
  return useQuery({
    queryKey: [
      "appointments",
      page,
      search,
      status,
      pageSize,
      doctorId,
      patientId,
      date,
    ],
    queryFn: () =>
      fetchAppointments(
        page,
        search,
        status,
        pageSize,
        doctorId,
        patientId,
        date
      ),
  });
}
