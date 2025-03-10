import { NextResponse } from "next/server";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: "Admitted" | "Discharged" | "Critical" | "Stable" | "Scheduled";
  department: string;
  doctor: string;
  lastVisit: string;
  admissionDate?: string;
  dischargeDate?: string;
  bedId?: string;
  roomType?: "General" | "Semi-Private" | "Private" | "ICU" | "Operation";
  image: string;
};

const initialPatients: Patient[] = [
  {
    id: "P-1001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    status: "Admitted",
    department: "Cardiology",
    doctor: "Dr. Sarah Johnson",
    lastVisit: "Today, 10:30 AM",
    admissionDate: "Mar 14, 2024",
    bedId: "B-101",
    roomType: "Private",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1002",
    name: "Emily Davis",
    age: 32,
    gender: "Female",
    status: "Discharged",
    department: "Orthopedics",
    doctor: "Dr. Michael Chen",
    lastVisit: "Today, 11:45 AM",
    admissionDate: "Mar 10, 2024",
    dischargeDate: "Mar 14, 2024",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1003",
    name: "Robert Johnson",
    age: 58,
    gender: "Male",
    status: "Critical",
    department: "ICU",
    doctor: "Dr. Lisa Wong",
    lastVisit: "Today, 09:15 AM",
    admissionDate: "Mar 12, 2024",
    bedId: "B-201",
    roomType: "ICU",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1004",
    name: "Sophia Martinez",
    age: 28,
    gender: "Female",
    status: "Stable",
    department: "Neurology",
    doctor: "Dr. James Wilson",
    lastVisit: "Today, 02:30 PM",
    admissionDate: "Mar 13, 2024",
    bedId: "B-102",
    roomType: "Semi-Private",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1005",
    name: "William Taylor",
    age: 67,
    gender: "Male",
    status: "Admitted",
    department: "Pulmonology",
    doctor: "Dr. Emma Brown",
    lastVisit: "Yesterday, 04:15 PM",
    admissionDate: "Mar 13, 2024",
    bedId: "B-103",
    roomType: "General",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1006",
    name: "Olivia Wilson",
    age: 42,
    gender: "Female",
    status: "Scheduled",
    department: "Gynecology",
    doctor: "Dr. Robert Garcia",
    lastVisit: "Tomorrow, 10:00 AM",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1007",
    name: "James Brown",
    age: 53,
    gender: "Male",
    status: "Discharged",
    department: "Gastroenterology",
    doctor: "Dr. Jennifer Lee",
    lastVisit: "Yesterday, 11:30 AM",
    admissionDate: "Mar 08, 2024",
    dischargeDate: "Mar 13, 2024",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1008",
    name: "Ava Johnson",
    age: 7,
    gender: "Female",
    status: "Admitted",
    department: "Pediatrics",
    doctor: "Dr. David Miller",
    lastVisit: "Today, 03:45 PM",
    admissionDate: "Mar 14, 2024",
    bedId: "B-301",
    roomType: "Private",
    image: "/placeholder.svg?height=32&width=32",
  },
];

const additionalPatients: Patient[] = [
  {
    id: "P-1009",
    name: "Liam Martinez",
    age: 36,
    gender: "Male",
    status: "Admitted",
    department: "Dermatology",
    doctor: "Dr. Olivia Harris",
    lastVisit: "Today, 01:00 PM",
    admissionDate: "Mar 15, 2024",
    bedId: "B-104",
    roomType: "Semi-Private",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1010",
    name: "Mia Taylor",
    age: 29,
    gender: "Female",
    status: "Scheduled",
    department: "Ophthalmology",
    doctor: "Dr. William Martinez",
    lastVisit: "Tomorrow, 09:00 AM",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1011",
    name: "Noah Anderson",
    age: 50,
    gender: "Male",
    status: "Stable",
    department: "Neurology",
    doctor: "Dr. Sophia Wilson",
    lastVisit: "Today, 12:00 PM",
    admissionDate: "Mar 14, 2024",
    bedId: "B-105",
    roomType: "General",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1012",
    name: "Isabella Thomas",
    age: 40,
    gender: "Female",
    status: "Critical",
    department: "ICU",
    doctor: "Dr. James Brown",
    lastVisit: "Today, 08:00 AM",
    admissionDate: "Mar 13, 2024",
    bedId: "B-106",
    roomType: "ICU",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1013",
    name: "Lucas White",
    age: 60,
    gender: "Male",
    status: "Discharged",
    department: "Cardiology",
    doctor: "Dr. Emily Davis",
    lastVisit: "Yesterday, 05:00 PM",
    admissionDate: "Mar 10, 2024",
    dischargeDate: "Mar 14, 2024",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1014",
    name: "Charlotte Harris",
    age: 35,
    gender: "Female",
    status: "Admitted",
    department: "Oncology",
    doctor: "Dr. Michael Johnson",
    lastVisit: "Today, 11:00 AM",
    admissionDate: "Mar 15, 2024",
    bedId: "B-107",
    roomType: "Private",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1015",
    name: "Henry Clark",
    age: 55,
    gender: "Male",
    status: "Scheduled",
    department: "Urology",
    doctor: "Dr. Ava Martinez",
    lastVisit: "Tomorrow, 02:00 PM",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1016",
    name: "Amelia Lewis",
    age: 48,
    gender: "Female",
    status: "Stable",
    department: "Endocrinology",
    doctor: "Dr. David Wilson",
    lastVisit: "Today, 03:00 PM",
    admissionDate: "Mar 14, 2024",
    bedId: "B-108",
    roomType: "Semi-Private",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1017",
    name: "Ethan Walker",
    age: 62,
    gender: "Male",
    status: "Critical",
    department: "ICU",
    doctor: "Dr. Emma Taylor",
    lastVisit: "Today, 07:00 AM",
    admissionDate: "Mar 13, 2024",
    bedId: "B-109",
    roomType: "ICU",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-1018",
    name: "Harper Hall",
    age: 30,
    gender: "Female",
    status: "Discharged",
    department: "Gastroenterology",
    doctor: "Dr. Robert Brown",
    lastVisit: "Yesterday, 06:00 PM",
    admissionDate: "Mar 09, 2024",
    dischargeDate: "Mar 13, 2024",
    image: "/placeholder.svg?height=32&width=32",
  },
];

const allPatients = [...initialPatients, ...additionalPatients];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 5;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedPatients = allPatients.slice(start, end);

    return NextResponse.json(paginatedPatients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
