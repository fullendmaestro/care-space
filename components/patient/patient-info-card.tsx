import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, FileText, Phone, Mail, MapPin } from "lucide-react";

interface PatientInfoCardProps {
  patient: any;
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
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

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Age:</span>
            <span className="ml-auto font-medium">
              {patient.details.age} years
            </span>
          </div>
          <div className="flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Gender:</span>
            <span className="ml-auto font-medium">
              {patient.details.gender}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Blood Group:</span>
            <span className="ml-auto font-medium">
              {patient.details.bloodGroup || "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phone:</span>
            <span className="ml-auto font-medium">
              {patient.details.contactNumber || "Not specified"}
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
              {patient.details.address || "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Date of Birth:</span>
            <span className="ml-auto font-medium">
              {patient.details.dateOfBirth
                ? formatDate(patient.dateOfBirth)
                : "Not specified"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
