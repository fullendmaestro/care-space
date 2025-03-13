import type React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Authentication - Hospital Management System",
  description: "Login or register to access the Hospital Management System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
