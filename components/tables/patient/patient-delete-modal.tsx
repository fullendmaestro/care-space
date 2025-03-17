import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { PatientData } from "@/types";

interface PatientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData | null;
  onDelete: () => void;
}

export function PatientDeleteModal({
  isOpen,
  onClose,
  patient,
  onDelete,
}: PatientDeleteModalProps) {
  return (
    <Modal
      title="Delete Patient"
      description="Are you sure you want to delete this patient? This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      {patient && (
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
            <div>
              <h4 className="font-medium text-amber-800">Warning</h4>
              <p className="text-sm text-amber-700">
                Deleting this patient will remove all their records,
                appointments, and medical history.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={onDelete}>
              Delete Patient
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
