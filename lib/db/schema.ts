import { PatientDetail } from "@/types";
import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  pgEnum,
  boolean,
  json,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "doctor",
  "nurse",
  "receptionist",
  "admin",
  "patient",
]);

export type UserRole =
  | "doctor"
  | "nurse"
  | "receptionist"
  | "admin"
  | "patient";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }),
  name: varchar("name", { length: 100 }),
  image: varchar("image", { length: 255 }).default("/avatar-placeholder.svg"),
  role: roleEnum("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Todo: Include Indexes on the tables

export type User = InferSelectModel<typeof user>;

export const staff = pgTable("Staff", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true),
  staffRole: varchar("role", { length: 20 }).default("admin"),
  details: json("details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Staff = InferSelectModel<typeof staff>;

export const patient = pgTable("Patient", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  patientId: varchar("patient_id", { length: 20 })
    .notNull()
    .unique()
    .$default(() => "name"),
  status: varchar("status", { length: 20 }).default("Active"),
  details: json("details").$type<PatientDetail>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Patient = InferSelectModel<typeof patient>;
