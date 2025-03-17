import { PatientDetail } from "@/types";
import { relations, type InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  pgEnum,
  boolean,
  json,
  text,
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
// Todo: Create a different table for
// storing roles which will be joined
// as the actual status on query

export type User = InferSelectModel<typeof user>;

export const staff = pgTable("Staff", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true),
  details: json("details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Staff = InferSelectModel<typeof staff>;

export const staffRelations = relations(staff, ({ one, many }) => ({
  user: one(user, {
    fields: [staff.userId],
    references: [user.id],
  }),
  schedules: many(doctorSchedule),
  appointments: many(appointment),
}));

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

export const patientRelations = relations(patient, ({ many }) => ({
  medicalRecords: many(medicalRecord),
  appointments: many(appointment),
}));

export const medicalRecord = pgTable("MedicalRecord", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  patientId: uuid("patient_id").references(() => patient.id, {
    onDelete: "cascade",
  }),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescription: text("prescription"),
  notes: text("notes"),
  visitDate: timestamp("visit_date").defaultNow(),
  doctorId: uuid("doctor_id").references(() => staff.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MedicalRecord = InferSelectModel<typeof medicalRecord>;

export const medicalRecordRelations = relations(medicalRecord, ({ one }) => ({
  patient: one(patient, {
    fields: [medicalRecord.patientId],
    references: [patient.id],
  }),
  doctor: one(staff, {
    fields: [medicalRecord.doctorId],
    references: [staff.id],
  }),
}));

export const doctorSchedule = pgTable("DoctorSchedule", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  doctorId: uuid("doctor_id").references(() => staff.id, {
    onDelete: "cascade",
  }),
  dayOfWeek: varchar("day_of_week", { length: 10 }).notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DoctorSchedule = InferSelectModel<typeof doctorSchedule>;

export const doctorScheduleRelations = relations(doctorSchedule, ({ one }) => ({
  doctor: one(staff, {
    fields: [doctorSchedule.doctorId],
    references: [staff.id],
  }),
}));

export const appointment = pgTable("Appointment", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  patientId: uuid("patient_id").references(() => patient.id, {
    onDelete: "cascade",
  }),
  doctorId: uuid("doctor_id").references(() => staff.id, {
    onDelete: "cascade",
  }),
  appointmentDate: timestamp("appointment_date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).default("Scheduled"),
  reason: text("reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Appointment = InferSelectModel<typeof appointment>;

export const appointmentRelations = relations(appointment, ({ one }) => ({
  patient: one(patient, {
    fields: [appointment.patientId],
    references: [patient.id],
  }),
  doctor: one(staff, {
    fields: [appointment.doctorId],
    references: [staff.id],
  }),
}));
