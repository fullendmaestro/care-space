import { useQuery } from "@tanstack/react-query";

// Patient stats hook
export function usePatientStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["patientStats"],
    queryFn: async () => {
      const response = await fetch("/api/stats/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patient statistics");
      }
      return response.json();
    },
  });

  return {
    stats: data,
    isLoading,
    error,
    refetch,
  };
}

// Appointment stats hook
export function useAppointmentStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["appointmentStats"],
    queryFn: async () => {
      const response = await fetch("/api/stats/appointments");
      if (!response.ok) {
        throw new Error("Failed to fetch appointment statistics");
      }
      return response.json();
    },
  });

  return {
    stats: data,
    isLoading,
    error,
    refetch,
  };
}
