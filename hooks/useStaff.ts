import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

async function fetchStaff(
  page: number,
  search: string,
  activeRole: string,
  pageSize: number
): Promise<{ data: Staff[]; totalItems: number }> {
  const role = activeRole !== "all" ? activeRole : undefined;
  const response = await axios.get(
    `/api/staff?page=${page}&limit=${pageSize}&search=${search}${
      role ? `&role=${role}` : ""
    }`
  );
  return {
    data: response.data,
    totalItems: Number.parseInt(response.headers["x-total-count"] || "0"),
  };
}

export default function useStaff(
  page: number,
  search: string,
  activeRole: string,
  pageSize: number
) {
  return useQuery({
    queryKey: ["staff", page, search, activeRole, pageSize],
    queryFn: () => fetchStaff(page, search, activeRole, pageSize),
  });
}
