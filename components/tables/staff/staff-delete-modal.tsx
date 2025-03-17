import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Staff {
  id: string;
  name: string;
}

interface StaffDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onDelete: () => void;
}

export function StaffDeleteModal({
  isOpen,
  onClose,
  staff,
  onDelete,
}: StaffDeleteModalProps) {
  return (
    <Modal
      title="Delete Staff Member"
      description="Are you sure you want to delete this staff member? This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      {staff && (
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
            <div>
              <h4 className="font-medium text-amber-800">Warning</h4>
              <p className="text-sm text-amber-700">
                Deleting this staff member will remove all their records,
                schedules, and appointments.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={onDelete}>
              Delete Staff
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
