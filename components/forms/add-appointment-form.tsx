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
import { SearchFilter } from "@/components/tables/search-filter";
import usePatients from "@/hooks/usePatients";
import useStaff from "@/hooks/useStaff";
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

  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const { data: patients, isLoading: isLoadingPatients } = usePatients(
    1,
    patientSearch,
    "all",
    10
  );
  const { data: doctors, isLoading: isLoadingDoctors } = useStaff(
    1,
    doctorSearch,
    "doctor",
    10
  );

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    const patientName = searchParams.get("patientName");

    if (patientId && patientName) {
      setFormData((prev) => ({
        ...prev,
        patientId,
        patientName,
      }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      <div className="space-y-2">
        <Label htmlFor="patientSearch">Search Patient</Label>
        <SearchFilter
          value={patientSearch}
          onChange={setPatientSearch}
          placeholder="Search for a patient..."
        />
        <Select
          value={formData.patientId}
          onValueChange={(value) => {
            const selectedPatient = patients?.data.find((p) => p.id === value);
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
            ) : patients?.data.length > 0 ? (
              patients.data.map((patient) => (
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctorSearch">Search Doctor</Label>
        <SearchFilter
          value={doctorSearch}
          onChange={setDoctorSearch}
          placeholder="Search for a doctor..."
        />
        <Select
          value={formData.doctorId}
          onValueChange={(value) => {
            const selectedDoctor = doctors?.data.find((d) => d.id === value);
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
            ) : doctors?.data.length > 0 ? (
              doctors.data.map((doctor) => (
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
