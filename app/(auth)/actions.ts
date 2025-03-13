"use server";

import { z } from "zod";

import {
  createPatient,
  createStaff,
  createUser,
  getUser,
} from "@/lib/db/queries";

import { signIn } from "./auth";
import { generatePatientId } from "@/lib/utils";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Register validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string(),
});

// Patient registration schema
const patientSchema = registerSchema.extend({
  age: z.number().optional(),
  gender: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

// Staff registration schema
const staffSchema = registerSchema.extend({
  specialization: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.string().optional(),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
}

export async function registerPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const age = formData.get("age")
    ? Number.parseInt(formData.get("age") as string)
    : undefined;
  const gender = formData.get("gender") as string;
  const contactNumber = formData.get("contactNumber") as string;
  const address = formData.get("address") as string;
  const dateOfBirth = formData.get("dateOfBirth")
    ? new Date(formData.get("dateOfBirth") as string)
    : null;
  const bloodGroup = formData.get("bloodGroup") as string;
  const allergies = formData.get("allergies") as string;
  const emergencyContact = formData.get("emergencyContact") as string;
  const emergencyPhone = formData.get("emergencyPhone") as string;

  // Validate form data
  const validatedFields = patientSchema.safeParse({
    name,
    email,
    password,
    role: "patient",
    age,
    gender,
    contactNumber,
    address,
    dateOfBirth,
    bloodGroup,
    allergies,
    emergencyContact,
    emergencyPhone,
  });

  console.log("patient", {
    name,
    email,
    password,
    role: "patient",
    age,
    gender,
    contactNumber,
    address,
    dateOfBirth,
    bloodGroup,
    allergies,
    emergencyContact,
    emergencyPhone,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check your inputs.",
    };
  }

  try {
    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser.length > 0) {
      return {
        error: "User with this email already exists.",
      };
    }

    // Create user
    const result = await createUser(email, password, name, "patient");

    // Generate a unique patient ID
    const patientId = generatePatientId();

    const patientDetail = {
      age,
      gender,
      contactNumber,
      address,
      dateOfBirth,
      bloodGroup,
      allergies,
      emergencyContact,
      emergencyPhone,
    };

    // Create patient record
    if (result) {
      await createPatient({
        patientId,
        status: "Active",
        details: patientDetail,
      });
    }

    // Sign in the user
    // await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });

    return { success: true };
  } catch (error) {
    return {
      error: "An error occurred during registration. Please try again.",
    };
  }
}

export async function registerStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const specialization = formData.get("specialization") as string;
  const contactNumber = formData.get("contactNumber") as string;
  const address = formData.get("address") as string;
  const dateOfBirth = formData.get("dateOfBirth")
    ? new Date(formData.get("dateOfBirth") as string)
    : null;
  const gender = formData.get("gender") as string;

  // Validate form data
  const validatedFields = staffSchema.safeParse({
    name,
    email,
    password,
    role,
    specialization,
    contactNumber,
    address,
    dateOfBirth,
    gender,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check your inputs.",
    };
  }

  try {
    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser.length > 0) {
      return {
        error: "User with this email already exists.",
      };
    }

    // Create user
    await createUser(email, password, name, role);

    const createdUser = await getUser(email);

    const staffDetails = {
      specialization,
      contactNumber,
      address,
      dateOfBirth,
      gender,
    };

    console.log("createdss user", createdUser);

    // Create staff record
    if (createdUser) {
      await createStaff({
        userId: createdUser.id,
        staffRole: role,
        isActive: true,
        details: staffDetails,
      });
    }

    // Sign in the user
    // await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // })

    return { success: true };
  } catch (error) {
    return {
      error: "An error occurred during registration. Please try again.",
    };
  }
}

export async function registerAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = "admin";

  // Validate form data
  const validatedFields = registerSchema.safeParse({
    name,
    email,
    password,
    role,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check your inputs.",
    };
  }

  try {
    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser.length > 0) {
      return {
        error: "User with this email already exists.",
      };
    }

    // Create user
    await createUser(email, password, name, role);

    // Sign in the user
    // await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // })

    return { success: true };
  } catch (error) {
    return {
      error: "An error occurred during registration. Please try again.",
    };
  }
}
