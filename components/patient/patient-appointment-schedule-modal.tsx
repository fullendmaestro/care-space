import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { PatientAppointmentForm } from "@/components/patient/patient-appointment-form";
import axios from "axios";
import { toast } from "sonner";
import { createAppointment } from "@/app/(patient)/action";

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
      await createAppointment(dataWithDefaults);
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
      <PatientAppointmentForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
