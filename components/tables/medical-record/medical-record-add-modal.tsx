import { Modal } from "@/components/ui/modal";
import { AddMedicalRecordForm } from "@/components/forms/add-medical-record-form";

interface MedicalRecordAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  patientId?: string;
}

export function MedicalRecordAddModal({
  isOpen,
  onClose,
  onSubmit,
  patientId,
}: MedicalRecordAddModalProps) {
  return (
    <Modal
      title="Add New Medical Record"
      description="Enter the medical record details below."
      isOpen={isOpen}
      onClose={onClose}
    >
      <AddMedicalRecordForm onSubmit={onSubmit} patientId={patientId} />
    </Modal>
  );
}
