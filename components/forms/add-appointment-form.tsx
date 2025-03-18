"use client";

import type React from "react";

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
import axios from "axios";
import { toast } from "sonner";
import { any } from "zod";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    patientId: initialData.patientId || "",
    patientName: initialData.patientName || "",
    doctorId: initialData.doctorId || "",
    doctorName: initialData.doctorName || "",
    appointmentDate: initialData.appointmentDate
      ? new Date(initialData.appointmentDate)
      : new Date(),
    startTime: initialData.startTime || "09:00",
    endTime: initialData.endTime || "09:30",
    status: initialData.status || "Scheduled",
    reason: initialData.reason || "",
  });

  const [doctors, setDoctors] = useState<any>([]);
  const [patients, setPatients] = useState<any>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  useEffect(() => {
    // Check if patientId and patientName are in the URL
    const patientId = searchParams.get("patientId");
    const patientName = searchParams.get("patientName");

    if (patientId && patientName) {
      setFormData((prev) => ({
        ...prev,
        patientId,
        patientName,
      }));
    }

    // Fetch doctors list
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const response = await axios.get("/api/staff?role=doctor");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    // Fetch patients list if patientId is not provided
    const fetchPatients = async () => {
      if (patientId) return;

      setIsLoadingPatients(true);
      try {
        const response = await axios.get("/api/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchDoctors();
    fetchPatients();
  }, [searchParams]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.patientId ||
      !formData.doctorId ||
      !formData.appointmentDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          {formData.patientId && formData.patientName ? (
            <Input id="patientName" value={formData.patientName} disabled />
          ) : (
            <Select
              value={formData.patientId}
              onValueChange={(value) => {
                const selectedPatient = patients.find(
                  (p: any) => p.id === value
                );
                handleChange("patientId", value);
                handleChange("patientName", selectedPatient?.name || "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingPatients ? (
                  <SelectItem value="loading" disabled>
                    Loading patients...
                  </SelectItem>
                ) : patients.length > 0 ? (
                  patients.map((patient: any) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No patients found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Select
            value={formData.doctorId}
            onValueChange={(value) => {
              const selectedDoctor = doctors.find((d: any) => d.id === value);
              handleChange("doctorId", value);
              handleChange("doctorName", selectedDoctor?.name || "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingDoctors ? (
                <SelectItem value="loading" disabled>
                  Loading doctors...
                </SelectItem>
              ) : doctors.length > 0 ? (
                doctors.map((doctor: any) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialization || "General"})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No doctors found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
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

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
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
