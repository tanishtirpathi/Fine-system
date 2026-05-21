import { cookies } from "next/headers";

const BASE_URL = "http://localhost:3000/api";

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