import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, asc, desc, eq, gt, gte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { Patient, patient, staff, Staff, user, type User } from "./schema";

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
  role: string,
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
