import type React from "react";
import Link from "next/link";
import { AuthIllustration } from "@/components/auth/auth-illustration";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side illustration */}
      <AuthIllustration
        title="Join Our Healthcare Platform"
        description="Register as a staff member, patient, or administrator to access our comprehensive healthcare management system"
      />

      {/* Right side registration form */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
