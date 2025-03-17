import { Modal } from "@/components/ui/modal";
import { AddAppointmentForm } from "@/components/forms/add-appointment-form";

interface AppointmentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export function AppointmentScheduleModal({
  isOpen,
  onClose,
  onSubmit,
}: AppointmentScheduleModalProps) {
  return (
    <Modal
      title="Schedule New Appointment"
      description="Enter the appointment details below."
      isOpen={isOpen}
      onClose={onClose}
    >
      <AddAppointmentForm onSubmit={onSubmit} />
    </Modal>
  );
}
