"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/queries";
import { patient, user, appointment, staff } from "@/lib/db/schema";
import { and, gte } from "drizzle-orm";

export async function getPatientProfile(email: string) {
  try {
    const result = await db
      .select({
        id: patient.id,
        patientId: patient.patientId,
        userId: patient.userId,
        status: patient.status,
        details: patient.details,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: patient.createdAt,
      })
      .from(patient)
      .leftJoin(user, eq(patient.userId, user.id))
      .where(eq(user.email, email));

    if (result.length === 0) {
      throw new Error("Staff profile not found");
    }

    return result[0];
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    throw new Error("Failed to fetch patient profile");
  }
}

export async function getPatientAppointments(patientId: string) {
  try {
    const result = await db
      .select({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        doctorName: user.name, // Fetching doctor name from user table
      })
      .from(appointment)
      .leftJoin(staff, eq(appointment.doctorId, staff.id))
      .leftJoin(user, eq(staff.userId, user.id)) // Join with user table
      .where(eq(appointment.patientId, patientId));

    return result;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw new Error("Failed to fetch patient appointments");
  }
}

export async function getUpcomingAppointments(patientId: string) {
  try {
    const now = new Date();
    const result = await db
      .select({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        doctorName: user.name, // Fetching doctor name from user table
      })
      .from(appointment)
      .leftJoin(staff, eq(appointment.doctorId, staff.id))
      .leftJoin(user, eq(staff.userId, user.id)) // Join with user table
      .where(
        and(
          eq(appointment.patientId, patientId),
          gte(appointment.appointmentDate, now)
        )
      );

    return result;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw new Error("Failed to fetch upcoming appointments");
  }
}

export async function createAppointment(data: {
  doctorEmail: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status?: string;
}) {
  try {
    console.log("Creating appointment:", data);

    // Fetch the doctorId using the provided doctorEmail
    const doctor = await db
      .select({ doctorId: staff.id })
      .from(staff)
      .leftJoin(user, eq(staff.userId, user.id))
      .where(eq(user.email, data.doctorEmail));

    if (doctor.length === 0) {
      throw new Error("Doctor not found");
    }

    const doctorId = doctor[0].doctorId;

    // Insert the appointment with the doctorId
    const result = await db.insert(appointment).values({
      doctorId,
      patientId: data.patientId,
      appointmentDate: new Date(data.appointmentDate),
      startTime: data.startTime,
      endTime: data.endTime,
      reason: data.reason,
      status: data.status || "Pending",
    });

    if (global.broadcastUpdate) {
      global.broadcastUpdate("appointments", {
        action: "create",
        data: "appointment created",
      });
    }

    return result;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Failed to create appointment");
  }
}
