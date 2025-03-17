import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

interface Staff {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface UpdateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onUpdate: (formData: any) => void;
  onDelete: () => void;
}

export function UpdateStaffModal({
  isOpen,
  onClose,
  staff,
  onUpdate,
  onDelete,
}: UpdateStaffModalProps) {
  const router = useRouter();

  return (
    <Modal
      title="Update Staff Status"
      description="Update staff active status."
      isOpen={isOpen}
      onClose={onClose}
    >
      {staff && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={staff.isActive}
                onCheckedChange={(checked) =>
                  onUpdate({ ...staff, isActive: checked })
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Toggle to set the staff member as active or inactive
            </p>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onUpdate({ isActive: staff.isActive });
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
            {staff.role === "doctor" && (
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  router.push(`/schedules?doctorId=${staff.id}`);
                }}
              >
                Manage Schedule
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={onDelete}
              className={staff.role === "doctor" ? "" : "col-span-2"}
            >
              Delete Staff
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onClose();
              router.push(`/staff/${staff.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      )}
    </Modal>
  );
}
