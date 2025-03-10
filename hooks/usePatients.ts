import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Patient } from "@/app/(dashboard)/api/patients/route";

async function fetchPosts(page: number): Promise<Patient[]> {
  const response = await axios.get(`/api/patients?page=${page}`);
  return response.data;
}

export default function usePatients(page: number) {
  return useQuery({
    queryKey: ["patients", page],
    queryFn: () => fetchPosts(page),
  });
}
