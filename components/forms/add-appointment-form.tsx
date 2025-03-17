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

interface AddAppointmentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function AddAppointmentForm({
  onSubmit,
  initialData = {},
  isLoading = false,
}: AddAppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: initialData.patientId || "",
    patientName: initialData.patientName || "",
    doctorId: initialData.doctorId || "",
    doctorName: initialData.doctorName || "",
    appointmentDate: initialData.appointmentDate
      ? new Date(initialData.appointmentDate)
      : null,
    startTime: initialData.startTime || "",
    endTime: initialData.endTime || "",
    status: initialData.status || "Scheduled",
    reason: initialData.reason || "",
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
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            value={formData.patientName}
            onChange={(e) => handleChange("patientName", e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            value={formData.doctorName}
            onChange={(e) => handleChange("doctorName", e.target.value)}
            placeholder="Dr. Smith"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointmentDate">Appointment Date</Label>
          <DatePicker
            selected={formData.appointmentDate}
            onSelect={(date) => handleChange("appointmentDate", date)}
            disabled={(date) => date < new Date()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Visit</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Describe the reason for the appointment"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData.id
          ? "Update Appointment"
          : "Schedule Appointment"}
      </Button>
    </form>
  );
}
