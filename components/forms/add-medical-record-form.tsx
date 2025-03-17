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

interface AddMedicalRecordFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
  patientId?: string;
}

export function AddMedicalRecordForm({
  onSubmit,
  initialData = {},
  isLoading = false,
  patientId,
}: AddMedicalRecordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    patientId: patientId || initialData.patientId || "",
    patientName: initialData.patientName || "",
    doctorId: initialData.doctorId || "",
    doctorName: initialData.doctorName || "",
    diagnosis: initialData.diagnosis || "",
    treatment: initialData.treatment || "",
    prescription: initialData.prescription || "",
    notes: initialData.notes || "",
    visitDate: initialData.visitDate
      ? new Date(initialData.visitDate)
      : new Date(),
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  useEffect(() => {
    // Check if patientId and patientName are in the URL
    const urlPatientId = searchParams.get("patientId");
    const urlPatientName = searchParams.get("patientName");

    if (urlPatientId && urlPatientName) {
      setFormData((prev) => ({
        ...prev,
        patientId: urlPatientId,
        patientName: urlPatientName,
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
      if (urlPatientId || patientId) return;

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
    if (!urlPatientId && !patientId) {
      fetchPatients();
    }
  }, [searchParams, patientId]);

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

      <div className="space-y-2">
        <Label htmlFor="visitDate">Visit Date</Label>
        <DatePicker
          selected={formData.visitDate}
          onSelect={(date) => handleChange("visitDate", date)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Textarea
          id="diagnosis"
          value={formData.diagnosis}
          onChange={(e) => handleChange("diagnosis", e.target.value)}
          placeholder="Enter diagnosis details"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Treatment</Label>
        <Textarea
          id="treatment"
          value={formData.treatment}
          onChange={(e) => handleChange("treatment", e.target.value)}
          placeholder="Enter treatment details"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prescription">Prescription</Label>
        <Textarea
          id="prescription"
          value={formData.prescription}
          onChange={(e) => handleChange("prescription", e.target.value)}
          placeholder="Enter prescription details"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Enter any additional notes"
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
            ? "Update Record"
            : "Add Record"}
        </Button>
      </div>
    </form>
  );
}
