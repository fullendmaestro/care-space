"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePatientStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  UserX,
  UserCog,
  Clock,
  AlertTriangle,
} from "lucide-react";
import React from "react";
import { PATIENT_STATUS_COLORS } from "@/const";

export function PatientOverview() {
  const { stats, isLoading, error } = usePatientStats();

  if (isLoading) return <PatientOverviewSkeleton />;

  if (error) {
    return (
      <Card className="col-span-4 shadow-sm">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-lg font-semibold">
            Patient Overview
          </CardTitle>
          <CardDescription>Failed to load patient statistics</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="text-destructive text-sm">
            Error loading patient data
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Admitted":
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case "Discharged":
        return <UserX className="h-5 w-5 text-green-500" />;
      case "Stable":
        return <UserCheck className="h-5 w-5 text-purple-500" />;
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "Scheduled":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <UserCog className="h-5 w-5" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "Admitted":
        return "Currently in hospital care";
      case "Discharged":
        return "Completed treatment";
      case "Stable":
        return "Regular monitoring";
      case "Critical":
        return "Intensive care required";
      case "Scheduled":
        return "Upcoming appointments";
      default:
        return "Patient status";
    }
  };

  return (
    <Card className="col-span-4 shadow-sm max-w-[1260px] mx-auto overflow-hidden">
      <CardHeader className="py-2 px-4 border-b bg-gray-50 dark:bg-gray-800">
        <CardTitle className="text-lg font-semibold">
          Patient Overview
        </CardTitle>
        <CardDescription className="text-xs">
          Current patient statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total patients card */}
          <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-medium text-muted-foreground">
                Total Patients
              </div>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {stats?.totalCount || 0}
            </div>
            <div className="text-[10px] text-muted-foreground">
              All active records
            </div>
          </div>

          {/* Status cards */}
          {stats?.statusCounts.map((item: any) => (
            <div
              key={item.status}
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
              style={{
                borderLeft: `2px solid ${PATIENT_STATUS_COLORS[item.status]}`,
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {item.status}
                </div>
                {getStatusIcon(item.status)}
              </div>
              <div className="text-2xl font-bold mb-1">{item.count}</div>
              <div className="text-[10px] text-muted-foreground flex items-center">
                <div
                  className="w-1.5 h-1.5 rounded-full mr-1"
                  style={{
                    backgroundColor: PATIENT_STATUS_COLORS[item.status],
                  }}
                ></div>
                {getStatusDescription(item.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PatientOverviewSkeleton() {
  return (
    <Card className="col-span-4 shadow-sm overflow-hidden">
      <CardHeader className="py-2 px-4 border-b bg-gray-50 dark:bg-gray-800">
        <CardTitle className="text-lg font-semibold">
          Patient Overview
        </CardTitle>
        <CardDescription className="text-xs">
          Current patient statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 bg-white dark:bg-gray-900">
        {/* Total patients card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-2 w-24" />
          </div>

          {/* Status cards - showing 5 cards for different statuses */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-8 w-12 mb-1" />
              <div className="flex items-center">
                <Skeleton className="h-1.5 w-1.5 rounded-full mr-1" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
