"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createRecord } from "@/app/(staff)/actions";

export function DoctorAddRecordModal({
  patientId,
  doctorId,
}: {
  patientId: string;
  doctorId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createRecord({ ...formData, patientId, doctorId });
      toast.success("Medical record added successfully");
      setIsOpen(false);
      setFormData({
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding medical record:", error);
      toast.error("Failed to add medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Record</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medical Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="diagnosis"
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
            />
            <Textarea
              name="treatment"
              placeholder="Treatment"
              value={formData.treatment}
              onChange={handleInputChange}
            />
            <Textarea
              name="prescription"
              placeholder="Prescription"
              value={formData.prescription}
              onChange={handleInputChange}
            />
            <Textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
