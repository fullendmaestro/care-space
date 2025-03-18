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
import { useState } from "react";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
}

interface AppointmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onUpdate: (formData: any) => void;
  onDelete: () => void;
}

export function AppointmentEditModal({
  isOpen,
  onClose,
  appointment,
  onUpdate,
  onDelete,
}: AppointmentEditModalProps) {
  const [status, setStatus] = useState(appointment?.status || "");

  return (
    <Modal
      title="Update Appointment Status"
      description="Update appointment status or cancel appointment."
      isOpen={isOpen}
      onClose={onClose}
    >
      {appointment && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Appointment Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onUpdate({ status });
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
                Or
              </span>
            </div>
          </div>

          <Button variant="destructive" className="w-full" onClick={onDelete}>
            Cancel Appointment
          </Button>
        </div>
      )}
    </Modal>
  );
}
