import { string, z } from "zod";
import { db } from "../db/queries";
import { eq, like, desc } from "drizzle-orm";
import { patient, user, staff, doctorSchedule } from "../db/schema";

export const aiTools = {
  getPatients: {
    description: "Get the current list of patients",
    parameters: z.object({ status: z.string().optional() }),
    execute: async ({ status }: { status?: string }) => {
      let query = db
        .select({
          id: patient.id,
          patientId: patient.patientId,
          name: user.name,
          email: user.email,
          status: patient.status,
        })
        .from(patient)
        .leftJoin(user, eq(patient.userId, user.id));

      if (status) {
        query.where(eq(patient.status, status));
      }

      return await query.orderBy(desc(patient.createdAt));
    },
  },
  getStaffs: {
    description: "Get the current list of Staffs",
    parameters: z.object({
      search: z.string().optional(),
      role: z.string().optional(),
    }),
    execute: async ({ search, role }: { search?: string; role?: string }) => {
      let query = db
        .select({
          id: staff.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: staff.isActive,
        })
        .from(staff)
        .leftJoin(user, eq(staff.userId, user.id));

      if (search) {
        query.where(like(user.name, `%${search}%`));
      }

      if (role) {
        query.where(eq(user.role, role));
      }

      return await query.orderBy(desc(staff.createdAt));
    },
  },
  getStaffSchedulebyId: {
    description: "Get the schedules of a staff by the staff id",
    parameters: z.object({
      id: string(),
    }),
    execute: async ({ id }: { id: string }) => {
      return await db
        .select({
          dayOfWeek: doctorSchedule.dayOfWeek,
          startTime: doctorSchedule.startTime,
          endTime: doctorSchedule.endTime,
          isAvailable: doctorSchedule.isAvailable,
        })
        .from(doctorSchedule)
        .where(eq(doctorSchedule.doctorId, id))
        .orderBy(doctorSchedule.dayOfWeek);
    },
  },
};
