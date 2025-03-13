DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('doctor', 'nurse', 'receptionist', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Appointment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"doctor_id" uuid,
	"appointment_date" timestamp NOT NULL,
	"start_time" varchar(10) NOT NULL,
	"end_time" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'Scheduled',
	"reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DoctorSchedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid,
	"day_of_week" varchar(10) NOT NULL,
	"start_time" varchar(10) NOT NULL,
	"end_time" varchar(10) NOT NULL,
	"is_available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MedicalRecord" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"diagnosis" text,
	"treatment" text,
	"prescription" text,
	"notes" text,
	"visit_date" timestamp DEFAULT now(),
	"doctor_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Patient" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"gender" varchar(10),
	"contact_number" varchar(20),
	"email" varchar(64),
	"address" text,
	"date_of_birth" timestamp,
	"blood_group" varchar(5),
	"allergies" text,
	"status" varchar(20) DEFAULT 'Active',
	"emergency_contact" varchar(100),
	"emergency_phone" varchar(20),
	"image" varchar(255) DEFAULT '/placeholder.svg?height=128&width=128',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "Patient_patient_id_unique" UNIQUE("patient_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar(100) NOT NULL,
	"role" "role" NOT NULL,
	"specialization" varchar(100),
	"contact_number" varchar(20),
	"email" varchar(64) NOT NULL,
	"address" text,
	"date_of_birth" timestamp,
	"gender" varchar(10),
	"is_active" boolean DEFAULT true,
	"image" varchar(255) DEFAULT '/placeholder.svg?height=128&width=128',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "role" varchar(20) DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patient_id_Patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctor_id_Staff_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."Staff"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_doctor_id_Staff_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."Staff"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patient_id_Patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctor_id_Staff_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."Staff"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Staff" ADD CONSTRAINT "Staff_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");