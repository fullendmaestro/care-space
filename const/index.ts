export const socketPath = "ws://localhost:3000/ws";

// Define consistent colors for each status
export const PATIENT_STATUS_COLORS: any = {
  Scheduled: "#FFBB28", // Yellow
  Admitted: "#0088FE", // Blue
  Discharged: "#00C49F", // Green
  Stable: "#8884D8", // Purple
  Critical: "#FF8042", // Orange
};

// Define consistent colors for appointment statuses (matching patient colors style)
export const APPOINTMENT_STATUS_COLORS: any = {
  scheduled: "#0088FE", // Blue
  completed: "#00C49F", // Green
  cancelled: "#FF8042", // Orange
  pending: "#FFBB28", // Yellow
  rescheduled: "#8884D8", // Purple
};
