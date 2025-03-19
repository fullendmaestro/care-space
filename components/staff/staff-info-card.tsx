import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, FileText, Phone, Mail, MapPin } from "lucide-react";

interface StaffInfoCardProps {
  staff: any;
}

export function StaffInfoCard({ staff }: StaffInfoCardProps) {
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
        <CardTitle>Staff Information</CardTitle>
        <CardDescription className="capitalize">{staff.role}</CardDescription>
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
          {staff.specialization && (
            <div className="flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Specialization:</span>
              <span className="ml-auto font-medium">
                {staff.specialization}
              </span>
            </div>
          )}
          {staff.gender && (
            <div className="flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Gender:</span>
              <span className="ml-auto font-medium">{staff.gender}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phone:</span>
            <span className="ml-auto font-medium">
              {staff.contactNumber || "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="ml-auto font-medium">{staff.email}</span>
          </div>
          {staff.address && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Address:</span>
              <span className="ml-auto font-medium">{staff.address}</span>
            </div>
          )}
          {staff.dateOfBirth && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date of Birth:</span>
              <span className="ml-auto font-medium">
                {formatDate(staff.dateOfBirth)}
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
  );
}
