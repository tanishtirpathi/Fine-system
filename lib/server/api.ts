import { cookies } from "next/headers";


export async function getMe() {

  const cookieStore = await cookies();

  const res = await fetch(`/api/me`, {
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
  const response = await fetch(`/api/allstudent`, {
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