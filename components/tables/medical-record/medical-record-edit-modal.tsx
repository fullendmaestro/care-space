import { Modal } from "@/components/ui/modal";
import { AddMedicalRecordForm } from "@/components/forms/add-medical-record-form";

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  visitDate: string;
}

interface MedicalRecordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  onDelete: () => void;
  record: MedicalRecord | null;
  patientId?: string;
}

export function MedicalRecordEditModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  record,
  patientId,
}: MedicalRecordEditModalProps) {
  return (
    <Modal
      title="Edit Medical Record"
      description="Update medical record information or delete record."
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onDelete}
      confirmText="Delete Record"
    >
      {record && (
        <AddMedicalRecordForm
          onSubmit={onSubmit}
          initialData={record}
          patientId={patientId}
        />
      )}
    </Modal>
  );
}
