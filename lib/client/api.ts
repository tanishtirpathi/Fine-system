const BASE_URL = "http://localhost:3000/api";
    
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
  const response = await fetch(`${BASE_URL}/login`, {
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

export type StudentFineUpdate = {
  fineAmount: number;
  fineStatus: "paid" | "unpaid";
  isCleared: boolean;
};

export async function updateStudentRecord(rollNo: string, data: StudentFineUpdate) {
  const response = await fetch(`/api/student/${encodeURIComponent(rollNo)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update student");
  }

  return result.student as import("@/types/student.types").Student;
}