import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  FileStack,
  Home,
  Settings,
  User as UserIcon,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/tooltip-provider";
import TooltipProvider from "@/components/tooltip-provider";
import { auth } from "../(auth)/auth";
import { User } from "@/components/user";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (
    session?.user.role !== "doctor" &&
    session?.user.role !== "nurse" &&
    session?.user.role !== "receptionist"
  ) {
    redirect("/login-back");
  }

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <StaffSidebar role={session?.user?.role} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex-1"></div>
            <User
              user={session?.user || { name: null, email: null, image: null }}
            />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function StaffSidebar({ role }: { role: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/staff"
          className="group flex h-14 w-14 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-14 md:w-14 md:text-base"
        >
          <UserIcon className="h-8 w-8 transition-all group-hover:scale-110" />
          <span className="sr-only">Staff Portal</span>
        </Link>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/patients"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Users className="h-5 w-5" />
                <span className="sr-only">Patients</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Patients</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/appointments"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Calendar className="h-5 w-5" />
                <span className="sr-only">Appointments</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Appointments</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/medical-records"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <FileStack className="h-5 w-5" />
                <span className="sr-only">Medical Records</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Medical Records</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {role === "doctor" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/staff/schedule"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span className="sr-only">My Schedule</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">My Schedule</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
