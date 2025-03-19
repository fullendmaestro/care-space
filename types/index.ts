import { Patient, User } from "../lib/db/schema";

/**
 * Complete patient type with user information
 */
export type PatientWithUser = Patient & {
  user: User;
};

/**
 * Patient data as returned by getPatients query
 */
export type PatientData = {
  id: string;
  userId: string;
  patientId: string;
  status: string;
  details: PatientDetail;
  name: string | null;
  email: string;
  image: string | null;
  role: "doctor" | "nurse" | "receptionist" | "admin" | "patient";
};

/**
 * New patient creation data
 */
export type PatientCreateData = {
  userId: string;
  patientId: string;
  status?: string;
  details?: string;
};

export type PatientDetail = {
  age?: number;
  gender?: string;
  contactNumber?: string;
  address?: string;
  dateOfBirth?: Date | null;
  bloodGroup?: string;
  allergies?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  specialization: string;
  contactNumber: string;
  email: string;
  isActive: boolean;
  image?: string;
  details?: any;
};
