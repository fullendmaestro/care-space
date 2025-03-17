import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import type { PatientData } from "@/types";

interface PatientUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData | null;
  onUpdate: (formData: any) => void;
  onDelete: () => void;
  router: ReturnType<typeof useRouter>;
}

export function PatientUpdateModal({
  isOpen,
  onClose,
  patient,
  onUpdate,
  onDelete,
  router,
}: PatientUpdateModalProps) {
  return (
    <Modal
      title="Update Patient Status"
      description="Update patient status or schedule an appointment."
      isOpen={isOpen}
      onClose={onClose}
    >
      {patient && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Patient Status</Label>
            <Select
              value={patient.status}
              onValueChange={(value) =>
                patient && onUpdate({ ...patient, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Admitted">Admitted</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Discharged">Discharged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onUpdate({ status: patient.status });
            }}
          >
            Update Status
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Actions
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                router.push(
                  `/appointments/add?patientId=${patient.id}&patientName=${patient.name}`
                );
              }}
            >
              Schedule Appointment
            </Button>

            <Button variant="destructive" onClick={onDelete}>
              Delete Patient
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                router.push(
                  `/medical-records/add?patientId=${patient.id}&patientName=${patient.name}`
                );
              }}
            >
              Add Medical Record
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                onClose();
                router.push(`/patients/${patient.id}`);
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
