"use client";

import { use, useEffect, useState } from "react";
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
  Activity,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { AddPatientForm } from "@/components/forms/add-patient-form";
import { PatientMedicalRecords } from "@/components/patient/patient-medical-records";
import { PatientAppointments } from "@/components/patient/patient-appointments";

type Params = Promise<{ id: string }>;

export default function PatientDetailPage({
  params: paramsPromise,
}: {
  params: Params;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const {
    data: patient,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["patient", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/patients/${params.id}`);
      return response.data;
    },
  });

  useEffect(() => {
    console.log("Patient data:", patient);
  }, [patient]);

  const handleUpdatePatient = async (formData: any) => {
    try {
      await axios.put(`/api/patients/${params.id}`, formData);
      toast.success("Patient updated successfully");
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update patient");
      console.error(error);
    }
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(`/api/patients/${params.id}`, {
        status: newStatus,
      });
      toast.success(`Patient status updated to ${newStatus}`);
      setIsChangeStatusOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update patient status");
      console.error(error);
    }
  };

  const handleDeletePatient = async () => {
    try {
      await axios.delete(`/api/patients/${params.id}`);
      toast.success("Patient deleted successfully");
      setIsDeleteModalOpen(false);
      router.push("/patients");
    } catch (error) {
      toast.error("Failed to delete patient");
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "Stable":
        return <Activity className="h-5 w-5 text-yellow-600" />;
      case "Admitted":
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case "Discharged":
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case "Scheduled":
        return <Calendar className="h-5 w-5 text-purple-600" />;
      default:
        return <UserPlus className="h-5 w-5 text-gray-600" />;
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

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The patient you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button onClick={() => router.push("/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
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
          <h1 className="text-2xl font-bold">{patient.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsChangeStatusOpen(true)}>
            Change Status
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Patient ID: {patient.patientId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={patient.image || "/placeholder.svg?height=128&width=128"}
                alt={patient.name}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center">
              <StatusBadge
                status={patient.status}
                className="text-sm px-3 py-1"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Age:</span>
                <span className="ml-auto font-medium">{patient.age} years</span>
              </div>
              <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Gender:</span>
                <span className="ml-auto font-medium">{patient.gender}</span>
              </div>
              <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Blood Group:</span>
                <span className="ml-auto font-medium">
                  {patient.bloodGroup || "Not specified"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="ml-auto font-medium">
                  {patient.dateOfBirth
                    ? formatDate(patient.dateOfBirth)
                    : "Not specified"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-auto font-medium">
                  {patient.contactNumber || "Not specified"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-auto font-medium">
                  {patient.email || "Not specified"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span className="ml-auto font-medium">
                  {patient.address || "Not specified"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Emergency Contact:
                </span>
                <span className="ml-auto font-medium">
                  {patient.emergencyContact || "Not specified"}
                </span>
              </div>
              <div className="flex items-center text-sm mt-1">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Emergency Phone:</span>
                <span className="ml-auto font-medium">
                  {patient.emergencyPhone || "Not specified"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center text-sm">
                <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Allergies:</span>
                <span className="ml-auto font-medium">
                  {patient.allergies || "None"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status-Based Resource Requirements</CardTitle>
            <CardDescription>
              Resources needed based on current status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-2 rounded-md border">
              <div className="flex items-center gap-2">
                {getStatusIcon(patient.status)}
                <span className="font-medium">{patient.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Staff Allocation</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.status === "Critical"
                      ? "3 staff per patient"
                      : patient.status === "Admitted"
                      ? "1 staff per patient"
                      : patient.status === "Stable"
                      ? "0.5 staff per patient"
                      : "As needed"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Monitoring Level</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.status === "Critical"
                      ? "Continuous"
                      : patient.status === "Admitted"
                      ? "Regular"
                      : patient.status === "Stable"
                      ? "Periodic"
                      : "As needed"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="medical-records">
        <TabsList>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="status-history">Status History</TabsTrigger>
        </TabsList>
        <TabsContent value="medical-records" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Medical Records</CardTitle>
              <Button
                onClick={() =>
                  router.push(
                    `/medical-records/add?patientId=${patient.id}&patientName=${patient.name}`
                  )
                }
              >
                Add Record
              </Button>
            </CardHeader>
            <CardContent>
              <PatientMedicalRecords patientId={patient.id} limit={10} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointments</CardTitle>
              <Button
                onClick={() =>
                  router.push(
                    `/appointments/add?patientId=${patient.id}&patientName=${patient.name}`
                  )
                }
              >
                Schedule Appointment
              </Button>
            </CardHeader>
            <CardContent>
              <PatientAppointments patientId={patient.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Status History</CardTitle>
              <CardDescription>
                Track how patient status has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {formatDate(new Date().toISOString())}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={patient.status} />
                    </TableCell>
                    <TableCell>Dr. Sarah Johnson</TableCell>
                    <TableCell>Current status</TableCell>
                  </TableRow>
                  {patient.status !== "Scheduled" && (
                    <TableRow>
                      <TableCell>
                        {formatDate(
                          new Date(
                            new Date().setDate(new Date().getDate() - 2)
                          ).toISOString()
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="Scheduled" />
                      </TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Initial appointment scheduled</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Patient Modal */}
      <Modal
        title="Edit Patient"
        description="Update patient information"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <AddPatientForm onSubmit={handleUpdatePatient} initialData={patient} />
      </Modal>

      {/* Change Status Modal */}
      <Modal
        title="Change Patient Status"
        description="Update the patient's current status"
        isOpen={isChangeStatusOpen}
        onClose={() => setIsChangeStatusOpen(false)}
        onConfirm={handleStatusChange}
        confirmText="Update Status"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              New Status
            </label>
            <select
              id="status"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value="Admitted">Admitted</option>
              <option value="Critical">Critical</option>
              <option value="Stable">Stable</option>
              <option value="Discharged">Discharged</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Patient"
        description="Are you sure you want to delete this patient? This action cannot be undone."
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePatient}
        confirmText="Delete Patient"
      >
        <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-md">
          <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
          <div>
            <h4 className="font-medium text-amber-800">Warning</h4>
            <p className="text-sm text-amber-700">
              Deleting this patient will remove all their records, appointments,
              and medical history.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
