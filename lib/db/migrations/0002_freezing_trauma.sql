DROP TABLE "Appointment";--> statement-breakpoint
DROP TABLE "DoctorSchedule";--> statement-breakpoint
DROP TABLE "MedicalRecord";--> statement-breakpoint
ALTER TABLE "Patient" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "Patient" ADD COLUMN "details" json;--> statement-breakpoint
ALTER TABLE "Staff" ADD COLUMN "details" json;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "image" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Patient" ADD CONSTRAINT "Patient_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "gender";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "contact_number";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "date_of_birth";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "blood_group";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "allergies";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "emergency_contact";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "emergency_phone";--> statement-breakpoint
ALTER TABLE "Patient" DROP COLUMN IF EXISTS "image";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "specialization";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "contact_number";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "date_of_birth";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "gender";--> statement-breakpoint
ALTER TABLE "Staff" DROP COLUMN IF EXISTS "image";