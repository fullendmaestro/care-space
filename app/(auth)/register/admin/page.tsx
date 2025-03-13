"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerAdmin } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "@/components/auth/step-indicator";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
  });

  const totalSteps = 2;

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate first step
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/register");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("department", formData.department);
      formDataObj.append("position", formData.position);

      const result = await registerAdmin(formDataObj);

      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Registration successful");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <StepIndicator currentStep={step} totalSteps={totalSteps} />
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
        <CardTitle className="text-2xl font-bold">
          Administrator Registration
        </CardTitle>
        <CardDescription>
          {step === 1 && "Create your account credentials"}
          {step === 2 && "Tell us about your administrative role"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="admin-registration-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Admin Name"
                  required
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hospital.com"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData("confirmPassword", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., IT, Finance, Operations"
                  value={formData.department}
                  onChange={(e) => updateFormData("department", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="e.g., Manager, Director, Coordinator"
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                />
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter>
        {step < totalSteps ? (
          <Button className="w-full" onClick={handleNext}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Complete Registration"}
            {!isLoading && <Check className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
