"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  toggleScheduleAvailability,
  deleteSchedule,
} from "@/app/(staff)/actions";

interface StaffScheduleProps {
  doctorId: string;
}

export function StaffSchedule({ doctorId }: StaffScheduleProps) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: "",
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true,
  });

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`/api/schedules?doctorId=${doctorId}`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (doctorId) {
      fetchSchedules();
    }
  }, [doctorId]);

  const handleAddSchedule = async () => {
    if (!newSchedule.dayOfWeek) {
      toast.error("Please select a day of the week");
      return;
    }

    try {
      const response = await axios.post("/api/schedules", {
        ...newSchedule,
        doctorId,
      });

      setSchedules([...schedules, response.data]);
      setIsAddingSchedule(false);
      setNewSchedule({
        dayOfWeek: "",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      });

      toast.success("Schedule added successfully");
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast.error("Failed to add schedule");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
      toast.success("Schedule deleted successfully");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule");
    }
  };

  const handleToggleAvailability = async (
    scheduleId: string,
    isAvailable: boolean
  ) => {
    try {
      await toggleScheduleAvailability(scheduleId, isAvailable);

      // Update the local state
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === scheduleId ? { ...schedule, isAvailable } : schedule
        )
      );

      toast.success("Availability updated");
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update availability");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>
    );
  }

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  // Sort schedules by day of week
  const sortedSchedules = [...schedules].sort(
    (a, b) =>
      dayOrder[a.dayOfWeek as keyof typeof dayOrder] -
      dayOrder[b.dayOfWeek as keyof typeof dayOrder]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSchedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{schedule.dayOfWeek}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDeleteSchedule(schedule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hours:</span>
                  <span className="text-sm">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`available-${schedule.id}`}
                    className="text-sm text-muted-foreground"
                  >
                    Available
                  </Label>
                  <Switch
                    id={`available-${schedule.id}`}
                    checked={schedule.isAvailable}
                    onCheckedChange={(checked) =>
                      handleToggleAvailability(schedule.id, checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {isAddingSchedule ? (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select
                    value={newSchedule.dayOfWeek}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, dayOfWeek: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAvailable" className="text-sm">
                    Available
                  </Label>
                  <Switch
                    id="isAvailable"
                    checked={newSchedule.isAvailable}
                    onCheckedChange={(checked) =>
                      setNewSchedule({ ...newSchedule, isAvailable: checked })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingSchedule(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSchedule}>Save</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="h-full min-h-[150px] border-dashed"
            onClick={() => setIsAddingSchedule(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        )}
      </div>
    </div>
  );
}
