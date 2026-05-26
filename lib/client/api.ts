const BASE_URL = "/api";

export async function verifyToken(token: string) {
  const response = await fetch(`${BASE_URL}/verify-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid token");
  }

  return response.json();
}

export async function loginUser(data: {
  identifier: string;
  password: string;
  role: string;
}) {
  const response = await fetch(`/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}

export type StudentUpdate = {
  name: string;
  rollNo: string;
  fatherNo: string;
  department: string;
  semester: number;
  fineAmount: number;
  fineStatus: "paid" | "unpaid";
  password?: string;
};

export type StudentUpdateResult = {
  student: import("@/types/student.types").Student;
  previousRollNo: string;
};

export async function updateStudentRecord(
  currentRollNo: string,
  data: StudentUpdate,
): Promise<StudentUpdateResult> {
  const response = await fetch(`/api/student/${encodeURIComponent(currentRollNo)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update student");
  }

  return {
    student: result.student,
    previousRollNo: result.previousRollNo ?? currentRollNo,
  };
}

export async function clearAllStudentFines() {
  const response = await fetch("/api/student/all-clear", {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to clear all fines");
  }

  return result.students as import("@/types/student.types").Student[];
}

export type StudentDashboardResponse = {
  meRollNo: string;
  me: import("@/types/student.types").Student | null;
  students: import("@/types/student.types").Student[];
};

export async function getStudentDashboard(): Promise<StudentDashboardResponse> {
  const response = await fetch("/api/student/dashboard", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load student dashboard");
  }

  return result as StudentDashboardResponse;
}
