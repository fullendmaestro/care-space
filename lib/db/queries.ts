import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import {
  aliasedTable,
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  like,
  sql,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  appointment,
  Appointment,
  DoctorSchedule,
  doctorSchedule,
  MedicalRecord,
  medicalRecord,
  Patient,
  patient,
  staff,
  Staff,
  user,
  UserRole,
  type User,
} from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  image?: string
) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db
      .insert(user)
      .values({ email, password: hash, name, role, image });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

// Patient queries
export async function getPatients(
  page = 1,
  limit = 10,
  search?: string,
  status?: string
) {
  try {
    const offset = (page - 1) * limit;
    let query = db
      .select({
        id: patient.id,
        userId: patient.userId,
        patientId: patient.patientId,
        status: patient.status,
        details: patient.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id))
      .limit(limit)
      .offset(offset);

    if (search) {
      // Todo: Search based on or patientId
      query.where(like(user.name, `%${search}%`));
    }

    if (status) {
      query.where(eq(patient.status, status));
    }

    return await query.orderBy(desc(patient.createdAt));
  } catch (error) {
    console.error("Failed to get patients from database");
    throw error;
  }
}

export async function getPatientsCount(search?: string, status?: string) {
  try {
    let query = db
      .select({ count: count() })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id));

    if (search) {
      query.where(like(user.name, `%${search}%`));
    }

    if (status) {
      query.where(eq(patient.status, status));
    }

    const result = await query;
    console.log("query count result", result);
    return result[0].count;
  } catch (error) {
    console.error("Failed to get patients count from database");
    throw error;
  }
}

export async function getPatientById(id: string) {
  try {
    return await db
      .select({
        id: patient.id,
        userId: patient.userId,
        patientId: patient.patientId,
        status: patient.status,
        details: patient.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id))
      .where(eq(patient.id, id));
  } catch (error) {
    console.error("Failed to get patient from database");
    throw error;
  }
}

export async function createPatient(
  data: Omit<Patient, "id" | "createdAt" | "updatedAt">
) {
  try {
    return await db.insert(patient).values(data);
  } catch (error) {
    console.error("Failed to create patient in database");
    throw error;
  }
}

export async function createStaff(
  data: Omit<Staff, "id" | "createdAt" | "updatedAt">
) {
  try {
    return await db.insert(staff).values(data);
  } catch (error) {
    console.error("Failed to create staff in database");
    throw error;
  }
}

export async function updatePatient(id: string, data: any) {
  try {
    // Extract user data if present
    const { name, email, image, ...patientData } = data;

    // Update patient record
    await db
      .update(patient)
      .set({
        status: patientData.status,
        updatedAt: new Date(),
      })
      .where(eq(patient.id, id));

    return { success: true };
  } catch (error) {
    console.error("Failed to update patient in database", error);
    throw error;
  }
}

export async function deletePatient(id: string) {
  try {
    // Get the patient record to find the associated user
    const patientRecord = await getPatientById(id);

    if (!patientRecord || patientRecord.length === 0) {
      throw new Error("Patient not found");
    }

    const userId = patientRecord[0].userId;

    // Delete the patient record
    await db.delete(patient).where(eq(patient.id, id));

    // Delete the associated user record as well
    if (userId) {
      await db.delete(user).where(eq(user.id, userId));
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete patient from database", error);
    throw error;
  }
}

// Staff queries
export async function getStaff(
  page = 1,
  limit = 10,
  search?: string,
  role?: any
) {
  try {
    const offset = (page - 1) * limit;
    let query = db
      .select({
        id: staff.id,
        userId: staff.userId,
        isActive: staff.isActive,
        details: staff.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .limit(limit)
      .offset(offset);

    if (search) {
      query.where(like(user.name, `%${search}%`));
    }

    if (role && role !== "all") {
      query.where(eq(user.role, role));
    }

    return await query.orderBy(desc(staff.createdAt));
  } catch (error) {
    console.error("Failed to get staff from database", error);
    throw error;
  }
}

export async function getStaffCount(search?: string, role?: any) {
  try {
    let query = db
      .select({ count: count() })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id));

    if (search) {
      query.where(like(user.name, `%${search}%`));
    }

    if (role && role !== "all") {
      query.where(eq(user.role, role));
    }

    const result = await query;
    return result[0].count;
  } catch (error) {
    console.error("Failed to get staff count from database", error);
    throw error;
  }
}

export async function getStaffById(id: string) {
  try {
    return await db
      .select({
        id: staff.id,
        userId: staff.userId,
        isActive: staff.isActive,
        details: staff.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .where(eq(staff.id, id));
  } catch (error) {
    console.error("Failed to get staff from database", error);
    throw error;
  }
}
export async function updateStaff(id: string, data: Partial<Staff>) {
  try {
    return await db
      .update(staff)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(staff.id, id));
  } catch (error) {
    console.error("Failed to update staff in database", error);
    throw error;
  }
}

export async function deleteStaff(id: string) {
  try {
    return await db.delete(staff).where(eq(staff.id, id));
  } catch (error) {
    console.error("Failed to delete staff from database", error);
    throw error;
  }
}

// Doctor Schedule queries
export async function getDoctorSchedules(doctorId: string) {
  try {
    return await db
      .select()
      .from(doctorSchedule)
      .where(eq(doctorSchedule.doctorId, doctorId))
      .orderBy(doctorSchedule.dayOfWeek);
  } catch (error) {
    console.error("Failed to get doctor schedules from database");
    throw error;
  }
}

export async function createDoctorSchedule(
  data: Omit<DoctorSchedule, "id" | "createdAt" | "updatedAt">
) {
  try {
    return await db.insert(doctorSchedule).values(data);
  } catch (error) {
    console.error("Failed to create doctor schedule in database");
    throw error;
  }
}

export async function updateDoctorSchedule(
  id: string,
  data: Partial<DoctorSchedule>
) {
  try {
    return await db
      .update(doctorSchedule)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(doctorSchedule.id, id));
  } catch (error) {
    console.error("Failed to update doctor schedule in database");
    throw error;
  }
}

export async function deleteDoctorSchedule(id: string) {
  try {
    return await db.delete(doctorSchedule).where(eq(doctorSchedule.id, id));
  } catch (error) {
    console.error("Failed to delete doctor schedule from database");
    throw error;
  }
}

// Appointment queries
export async function getAppointments(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  doctorId?: string,
  patientId?: string
) {
  try {
    const offset = (page - 1) * limit;

    // Join with patient and staff tables to get names
    const doctorUser = aliasedTable(user, "doctorUser");
    const query = db
      .select({
        id: appointment.id,
        patientId: appointment.patientId,
        patientName: user.name,
        doctorId: appointment.doctorId,
        doctorName: doctorUser.name,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })
      .from(appointment)
      .leftJoin(patient, eq(appointment.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .leftJoin(staff, eq(appointment.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id))
      .limit(limit)
      .offset(offset);

    if (search) {
      query.where(like(user.name, `%${search}%`));
    }

    if (status) {
      query.where(eq(appointment.status, status));
    }

    if (doctorId) {
      query.where(eq(appointment.doctorId, doctorId));
    }

    if (patientId) {
      query.where(eq(appointment.patientId, patientId));
    }

    return await query.orderBy(desc(appointment.appointmentDate));
  } catch (error) {
    console.error("Failed to get appointments from database");
    throw error;
  }
}

export async function getAppointmentsCount(
  search?: string,
  status?: string,
  doctorId?: string,
  patientId?: string
) {
  try {
    const doctorUser = aliasedTable(user, "doctorUser");
    const query = db
      .select({ count: count() })
      .from(appointment)
      .leftJoin(patient, eq(appointment.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .leftJoin(staff, eq(appointment.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id));

    if (search) {
      query.where(like(user.name, `%${search}%`));
    }

    if (status) {
      query.where(eq(appointment.status, status));
    }

    if (doctorId) {
      query.where(eq(appointment.doctorId, doctorId));
    }

    if (patientId) {
      query.where(eq(appointment.patientId, patientId));
    }

    const result = await query;
    return result[0].count;
  } catch (error) {
    console.error("Failed to get appointments count from database");
    throw error;
  }
}

export async function getAppointmentById(id: string) {
  try {
    const doctorUser = aliasedTable(user, "doctorUser");
    return await db
      .select({
        id: appointment.id,
        patientId: appointment.patientId,
        patientName: user.name,
        doctorId: appointment.doctorId,
        doctorName: doctorUser.name,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })
      .from(appointment)
      .leftJoin(patient, eq(appointment.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .leftJoin(staff, eq(appointment.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id))
      .where(eq(appointment.id, id));
  } catch (error) {
    console.error("Failed to get appointment from database");
    throw error;
  }
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "createdAt" | "updatedAt">
) {
  try {
    return await db.insert(appointment).values(data);
  } catch (error) {
    console.error("Failed to create appointment in database");
    throw error;
  }
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
) {
  try {
    return await db
      .update(appointment)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(appointment.id, id));
  } catch (error) {
    console.error("Failed to update appointment in database");
    throw error;
  }
}

export async function deleteAppointment(id: string) {
  try {
    return await db.delete(appointment).where(eq(appointment.id, id));
  } catch (error) {
    console.error("Failed to delete appointment from database");
    throw error;
  }
}
// Medical Record queries
export async function getMedicalRecords(
  page = 1,
  limit = 10,
  search?: string,
  patientId?: string,
  doctorId?: string
) {
  try {
    const offset = (page - 1) * limit;

    // Join with patient and staff tables to get names
    const doctorUser = aliasedTable(user, "doctorUser");
    let query = db
      .select({
        id: medicalRecord.id,
        patientId: medicalRecord.patientId,
        patientName: user.name,
        doctorId: medicalRecord.doctorId,
        doctorName: doctorUser.name,
        diagnosis: medicalRecord.diagnosis,
        treatment: medicalRecord.treatment,
        prescription: medicalRecord.prescription,
        notes: medicalRecord.notes,
        visitDate: medicalRecord.visitDate,
        createdAt: medicalRecord.createdAt,
        updatedAt: medicalRecord.updatedAt,
      })
      .from(medicalRecord)
      .leftJoin(patient, eq(medicalRecord.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .leftJoin(staff, eq(medicalRecord.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id))
      .limit(limit)
      .offset(offset);

    if (search) {
      query.where(
        sql`${medicalRecord.diagnosis} LIKE ${`%${search}%`} OR ${
          user.name
        } LIKE ${`%${search}%`}`
      );
    }

    if (patientId) {
      query.where(eq(medicalRecord.patientId, patientId));
    }

    if (doctorId) {
      query.where(eq(medicalRecord.doctorId, doctorId));
    }

    return await query.orderBy(desc(medicalRecord.visitDate));
  } catch (error) {
    console.error("Failed to get medical records from database");
    throw error;
  }
}

export async function getMedicalRecordsCount(
  search?: string,
  patientId?: string,
  doctorId?: string
) {
  try {
    const query = db
      .select({ count: count() })
      .from(medicalRecord)
      .leftJoin(patient, eq(medicalRecord.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id));

    if (search) {
      query.where(
        sql`${medicalRecord.diagnosis} LIKE ${`%${search}%`} OR ${
          user.name
        } LIKE ${`%${search}%`}`
      );
    }

    if (patientId) {
      query.where(eq(medicalRecord.patientId, patientId));
    }

    if (doctorId) {
      query.where(eq(medicalRecord.doctorId, doctorId));
    }

    const result = await query;
    return result[0].count;
  } catch (error) {
    console.error("Failed to get medical records count from database");
    throw error;
  }
}

export async function getMedicalRecordById(id: string) {
  try {
    const doctorUser = aliasedTable(user, "doctorUser");
    return await db
      .select({
        id: medicalRecord.id,
        patientId: medicalRecord.patientId,
        patientName: user.name,
        doctorId: medicalRecord.doctorId,
        doctorName: doctorUser.name,
        diagnosis: medicalRecord.diagnosis,
        treatment: medicalRecord.treatment,
        prescription: medicalRecord.prescription,
        notes: medicalRecord.notes,
        visitDate: medicalRecord.visitDate,
        createdAt: medicalRecord.createdAt,
        updatedAt: medicalRecord.updatedAt,
      })
      .from(medicalRecord)
      .leftJoin(patient, eq(medicalRecord.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .leftJoin(staff, eq(medicalRecord.doctorId, staff.id))
      .leftJoin(doctorUser, eq(staff.userId, doctorUser.id))
      .where(eq(medicalRecord.id, id));
  } catch (error) {
    console.error("Failed to get medical record from database");
    throw error;
  }
}

export async function createMedicalRecord(
  data: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">
) {
  try {
    console.log("create medical rocord data", data);
    return await db.insert(medicalRecord).values(data);
  } catch (error) {
    console.error("Failed to create medical record in database");
    throw error;
  }
}

export async function updateMedicalRecord(
  id: string,
  data: Partial<MedicalRecord>
) {
  try {
    return await db
      .update(medicalRecord)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(medicalRecord.id, id));
  } catch (error) {
    console.error("Failed to update medical record in database");
    throw error;
  }
}

export async function deleteMedicalRecord(id: string) {
  try {
    return await db.delete(medicalRecord).where(eq(medicalRecord.id, id));
  } catch (error) {
    console.error("Failed to delete medical record from database");
    throw error;
  }
}
