import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { AddAppointmentForm } from "@/components/forms/add-appointment-form";
import axios from "axios";
import { toast } from "sonner";

interface PatientAppointmentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onRefresh?: () => void;
}

export function PatientAppointmentScheduleModal({
  isOpen,
  onClose,
  patientId,
  onRefresh,
}: PatientAppointmentScheduleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const dataWithDefaults = { ...formData, patientId, status: "Pending" };
      await axios.post("/api/appointments", dataWithDefaults);
      toast.success("Appointment scheduled successfully with Pending status");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to schedule appointment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Schedule New Appointment"
      description="Enter the appointment details below. The status will be set to Pending."
      isOpen={isOpen}
      onClose={onClose}
    >
      <AddAppointmentForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        hidePatientField={true} // Ensure patient field is hidden
        fixedStatus="Pending" // Ensure status is fixed to "Pending"
      />
    </Modal>
  );
}
