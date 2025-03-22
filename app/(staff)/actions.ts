"use server";

import { updateDoctorSchedule, deleteDoctorSchedule } from "@/lib/db/queries";
import { db } from "@/lib/db/queries";
import { staff, user, appointment, patient } from "@/lib/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import { medicalRecord } from "@/lib/db/schema";

export async function toggleScheduleAvailability(
  scheduleId: string,
  isAvailable: boolean
) {
  try {
    await updateDoctorSchedule(scheduleId, { isAvailable });
    console.log(
      `Schedule ${scheduleId} availability updated to ${isAvailable}`
    );
  } catch (error) {
    console.error("Failed to toggle schedule availability:", error);
    throw new Error("Failed to toggle schedule availability");
  }
}

export async function deleteSchedule(scheduleId: string) {
  try {
    await deleteDoctorSchedule(scheduleId);
    console.log(`Schedule ${scheduleId} deleted successfully`);
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    throw new Error("Failed to delete schedule");
  }
}

export async function deleteSch(scheduleId: string) {
  console.log("toggling availaible. .............", scheduleId);
}

export async function getStaffProfile(email: string) {
  try {
    const result = await db
      .select({
        id: staff.id,
        userId: staff.userId,
        isActive: staff.isActive,
        details: staff.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: staff.createdAt,
      })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .where(eq(user.email, email));

    if (result.length === 0) {
      throw new Error("Staff profile not found");
    }

    return result[0];
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    throw new Error("Failed to fetch staff profile");
  }
}

export async function getDoctorAppointments(doctorId: string) {
  try {
    const result = await db
      .select({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        patientName: user.name,
      })
      .from(appointment)
      .leftJoin(patient, eq(appointment.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .where(eq(appointment.doctorId, doctorId))
      .orderBy(appointment.appointmentDate, appointment.startTime);

    return result;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw new Error("Failed to fetch doctor appointments");
  }
}

export async function getDoctorTodaysAppointments(doctorId: string) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await db
      .select({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        patientName: user.name,
      })
      .from(appointment)
      .leftJoin(patient, eq(appointment.patientId, patient.id))
      .leftJoin(user, eq(patient.userId, user.id))
      .where(
        and(
          eq(appointment.doctorId, doctorId),
          sql`DATE(${appointment.appointmentDate}) = ${today}`
        )
      )
      .orderBy(appointment.startTime);

    return result;
  } catch (error) {
    console.error("Error fetching today's doctor appointments:", error);
    throw new Error("Failed to fetch today's doctor appointments");
  }
}

export async function getPatientsByStaff(staffId: string, limit?: number) {
  try {
    const result = await db
      .select({
        id: patient.id,
        patientId: patient.patientId,
        name: user.name,
        age: sql`details->>'age'`.as("age"), // Assuming age is stored in details JSON
        gender: sql`details->>'gender'`.as("gender"), // Assuming gender is stored in details JSON
        status: patient.status,
        image: user.image,
      })
      .from(patient)
      .innerJoin(user, eq(patient.userId, user.id))
      .innerJoin(appointment, eq(patient.id, appointment.patientId))
      .where(eq(appointment.doctorId, staffId))
      .orderBy(desc(patient.updatedAt))
      .limit(limit || 10);

    return result;
  } catch (error) {
    console.error("Error fetching patients by staff:", error);
    throw new Error("Failed to fetch patients by staff");
  }
}

export async function createRecord({
  patientId,
  doctorId,
  diagnosis,
  treatment,
  prescription,
  notes,
}: {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
}) {
  try {
    await db.insert(medicalRecord).values({
      patientId,
      doctorId,
      diagnosis,
      treatment,
      prescription,
      notes,
    });
    console.log("Medical record created successfully");
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw new Error("Failed to create medical record");
  }
}
