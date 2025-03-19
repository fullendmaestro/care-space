"use client";
import { useState } from "react";
import type React from "react";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  contactNumber: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
  image: string;
  createdAt: string;
}

interface Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  patientId: string;
  patientName?: string;
}

export default function StaffDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/staff/${params.id}`);
      return response.data;
    },
  });

  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    refetch: refetchSchedules,
  } = useQuery({
    queryKey: ["schedules", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/schedules?doctorId=${params.id}`);
      return response.data;
    },
    enabled: !!params.id,
  });

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments", params.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/appointments?doctorId=${params.id}`
      );
      return response.data;
    },
    enabled: !!params.id && staff?.role === "doctor",
  });

  const handleAddSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await axios.post("/api/schedules", {
        doctorId: params.id,
        dayOfWeek: formData.get("dayOfWeek"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        isAvailable: true,
      });

      toast.success("Schedule added successfully");
      setIsAddScheduleOpen(false);
      refetchSchedules();
    } catch (error) {
      toast.error("Failed to add schedule");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Staff Member Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The staff member you&apos;re looking for doesn&apos;t exist or has
          been removed.
        </p>
        <Button onClick={() => router.push("/staff")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{staff.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              staff.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {staff.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <Button onClick={() => {}}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription className="capitalize">
              {staff.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={staff.image || "/placeholder.svg?height=128&width=128"}
                alt={staff.name}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
            <div className="space-y-2">
              {staff.details.specialization && (
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Specialization:</span>
                  <span className="ml-auto font-medium">
                    {staff.details.specialization}
                  </span>
                </div>
              )}
              {staff.details.gender && (
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="ml-auto font-medium">
                    {staff.details.gender}
                  </span>
                </div>
              )}
              {staff.details.dateOfBirth && (
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="ml-auto font-medium">
                    {formatDate(staff.details.dateOfBirth)}
                  </span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="ml-auto font-medium">
                  {formatDate(staff.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="ml-auto font-medium">
                    {staff.details.contactNumber || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-auto font-medium">{staff.email}</span>
                </div>
                {staff.details.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Address:</span>
                    <span className="ml-auto font-medium">
                      {staff.details.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {staff.role === "doctor" && (
        <Tabs defaultValue="schedules">
          <TabsList>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          <TabsContent value="schedules" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Doctor Schedules</CardTitle>
                <Dialog
                  open={isAddScheduleOpen}
                  onOpenChange={setIsAddScheduleOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Schedule</DialogTitle>
                      <DialogDescription>
                        Set up a new weekly schedule for the doctor.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSchedule}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dayOfWeek" className="text-right">
                            Day
                          </Label>
                          <select
                            id="dayOfWeek"
                            name="dayOfWeek"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Select day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="startTime" className="text-right">
                            Start Time
                          </Label>
                          <Input
                            id="startTime"
                            name="startTime"
                            placeholder="09:00 AM"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endTime" className="text-right">
                            End Time
                          </Label>
                          <Input
                            id="endTime"
                            name="endTime"
                            placeholder="05:00 PM"
                            className="col-span-3"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Schedule</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoadingSchedules ? (
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
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules?.length > 0 ? (
                        schedules.map((schedule: Schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>{schedule.dayOfWeek}</TableCell>
                            <TableCell>{schedule.startTime}</TableCell>
                            <TableCell>{schedule.endTime}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  schedule.isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {schedule.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No schedules found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
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
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments?.length > 0 ? (
                        appointments.map((appointment: Appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              {formatDate(appointment.appointmentDate)}
                            </TableCell>
                            <TableCell>
                              {appointment.startTime} - {appointment.endTime}
                            </TableCell>
                            <TableCell>
                              {appointment.patientName || "Unknown"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  appointment.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </TableCell>
                            <TableCell>{appointment.reason}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No appointments found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
