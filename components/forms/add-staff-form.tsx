"use client";

import type React from "react";

import { useState } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface AddStaffFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function AddStaffForm({
  onSubmit,
  initialData = {},
  isLoading = false,
}: AddStaffFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    role: initialData.role || "doctor",
    specialization: initialData.specialization || "",
    contactNumber: initialData.contactNumber || "",
    email: initialData.email || "",
    address: initialData.address || "",
    dateOfBirth: initialData.dateOfBirth
      ? new Date(initialData.dateOfBirth)
      : null,
    gender: initialData.gender || "",
    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="nurse">Nurse</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            id="specialization"
            value={formData.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
            placeholder="e.g., Cardiology, Pediatrics"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Status</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Toggle to set the staff member as active or inactive
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData.id
          ? "Update Staff"
          : "Add Staff"}
      </Button>
    </form>
  );
}
