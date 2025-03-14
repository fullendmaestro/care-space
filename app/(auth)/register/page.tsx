"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, Stethoscope, ShieldCheck } from "lucide-react";

export default function RegisterTypePage() {
  const router = useRouter();

  const registrationTypes = [
    {
      title: "Staff",
      description: "For doctors, nurses, and other healthcare professionals",
      icon: <Stethoscope className="h-6 w-6" />,
      href: "/register/staff",
    },
    {
      title: "Patient",
      description: "For individuals seeking healthcare services",
      icon: <UserRound className="h-6 w-6" />,
      href: "/register/patient",
    },
    {
      title: "Administrator",
      description: "For hospital management and administrative staff",
      icon: <ShieldCheck className="h-6 w-6" />,
      href: "/register/admin",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Choose your account type to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registrationTypes.map((type) => (
          <Button
            key={type.title}
            variant="outline"
            className="w-full justify-start h-auto p-4 text-left"
            onClick={() => router.push(type.href)}
          >
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {type.icon}
              </div>
              <div>
                <h3 className="font-medium">{type.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
