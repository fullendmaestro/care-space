// Function to dynamically determine WebSocket URL based on current environment
export const getSocketPath = () => {
  // In browser environment
  // if (typeof window !== "undefined") {
  //   const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  //   const host = window.location.host; // Includes hostname and port if present
  //   return `${protocol}//${host}/ws`;
  // }
  // Fallback for server-side rendering
  return "ws://localhost:3000/ws";
};

// For backward compatibility
export const socketPath = getSocketPath();

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
