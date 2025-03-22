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
import { SearchFilter } from "../tables/search-filter";

interface AddMedicalRecordFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function AddMedicalRecordForm({
  onSubmit,
  initialData = {},
  isLoading = false,
}: AddMedicalRecordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    patientEmail: initialData.patientEmail || "",
    doctorEmail: initialData.doctorEmail || "",
    diagnosis: initialData.diagnosis || "",
    treatment: initialData.treatment || "",
    prescription: initialData.prescription || "",
    notes: initialData.notes || "",
    visitDate: initialData.visitDate
      ? new Date(initialData.visitDate)
      : new Date(),
  });

  useEffect(() => {
    // Check if patientEmail is in the URL
    const urlPatientEmail = searchParams.get("patientEmail");

    if (urlPatientEmail) {
      setFormData((prev) => ({
        ...prev,
        patientEmail: urlPatientEmail,
      }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientSearch">Patient Email</Label>
        <Input
          placeholder="please enter the patient user email"
          onChange={(e) => handleChange("patientEmail", e.target.value)}
          value={formData.patientEmail}
          type="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctorSearch">Doctor Email</Label>
        <Input
          placeholder="please enter the doctor user email"
          onChange={(e) => handleChange("doctorEmail", e.target.value)}
          value={formData.doctorEmail}
          type="email"
          required
        />
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
