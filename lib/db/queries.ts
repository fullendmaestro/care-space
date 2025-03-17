import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, asc, count, desc, eq, gt, gte, inArray, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
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
      .select()
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

    console.log("to be updated patient", data, id);

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

    console.log(patientRecord);
    if (!patientRecord || patientRecord.length === 0) {
      throw new Error("Patient not found");
    }

    const userId = patientRecord[0].Patient.userId;

    console.log("to be deleted userid", userId);

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
    return await db.select().from(staff).where(eq(staff.id, id));
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
