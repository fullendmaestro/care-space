"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerStaff } from "@/app//(auth)/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { StepIndicator } from "@/components/auth/step-indicator";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { FileUpload } from "@/components/auth/file-upload";

export default function StaffRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
    role: "doctor",
    specialization: "",
    contactNumber: "",
    address: "",
    dateOfBirth: null as Date | null,
    gender: "",
  });

  const totalSteps = 3;

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

    if (step === 2) {
      // Validate second step
      if (!formData.role || !formData.contactNumber) {
        toast.error("Please fill in all required fields");
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
      formDataObj.append("image", formData.image);
      formDataObj.append("role", formData.role);
      formDataObj.append("specialization", formData.specialization);
      formDataObj.append("contactNumber", formData.contactNumber);
      formDataObj.append("address", formData.address);
      if (formData.dateOfBirth) {
        formDataObj.append("dateOfBirth", formData.dateOfBirth.toISOString());
      }
      formDataObj.append("gender", formData.gender);

      const result = await registerStaff(formDataObj);

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
        <CardTitle className="text-2xl font-bold">Staff Registration</CardTitle>
        <CardDescription>
          {step === 1 && "Create your account credentials"}
          {step === 2 && "Tell us about your professional details"}
          {step === 3 && "Complete your personal information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="staff-registration-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. John Doe"
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
                  placeholder="doctor@hospital.com"
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
              <div className="space-y-2">
                <Label>Upload Profile</Label>
                <FileUpload
                  label="Profile Photo"
                  accept="image/*"
                  onUploadComplete={(url: string) => {
                    updateFormData("image", url);
                  }}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="role">Staff Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Cardiology, Pediatrics"
                  value={formData.specialization}
                  onChange={(e) =>
                    updateFormData("specialization", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  placeholder="+1 (555) 123-4567"
                  required
                  value={formData.contactNumber}
                  onChange={(e) =>
                    updateFormData("contactNumber", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateFormData("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <DatePicker
                  selected={formData.dateOfBirth}
                  onSelect={(date) => updateFormData("dateOfBirth", date)}
                  disabled={(date) => date > new Date()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
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
