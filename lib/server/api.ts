import { cookies } from "next/headers";

const BASE_URL = "/api";

export async function getMe() {

  const cookieStore = await cookies();

  const res = await fetch(`${BASE_URL}/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export async function allStudents() {

  const cookieStore = await cookies();
  const response = await fetch(`${BASE_URL}/allstudent`, {
    method: "POST",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}