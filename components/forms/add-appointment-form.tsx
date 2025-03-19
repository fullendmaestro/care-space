"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "sonner";

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
    patientEmail: initialData.patientId || "",
    doctorEmail: initialData.doctorId || "",
    appointmentDate: initialData.appointmentDate
      ? new Date(initialData.appointmentDate)
      : new Date(),
    startTime: initialData.startTime || "09:00",
    endTime: initialData.endTime || "09:30",
    status: initialData.status || "Scheduled",
    reason: initialData.reason || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patientEmail ||
      !formData.doctorEmail ||
      !formData.appointmentDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientSearch">Patient Email</Label>
        <Input
          placeholder="please enter the patient user email"
          onChange={(e) => handleChange("patientEmail", e.target.value)}
          type="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctorSearch">Doctor Email</Label>
        <Input
          placeholder="please enter the doctor user email"
          onChange={(e) => handleChange("doctorEmail", e.target.value)}
          type="email"
          required
        />
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

      <div className="flex justify-end space-x-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : initialData.id
            ? "Update Appointment"
            : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
}
