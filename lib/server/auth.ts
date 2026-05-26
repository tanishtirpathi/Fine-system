import { NextResponse } from "next/server";
import { isLoggedIn } from "@/app/middleware/isLoggedIn";

export type AuthUser = {
  userId: string;
  role: string;
  name?: string;
  identifier?: string;
};

export async function requireTeacher(): Promise<
  { user: AuthUser } | { response: NextResponse }
> {
  try {
    const decoded = await isLoggedIn();

    if (typeof decoded !== "object" || !decoded || !("role" in decoded)) {
      return {
        response: NextResponse.json({ message: "Invalid session" }, { status: 401 }),
      };
    }

    const user = decoded as AuthUser;

    if (user.role !== "teacher") {
      return {
        response: NextResponse.json(
          { message: "Forbidden: only faculty can perform this action" },
          { status: 403 },
        ),
      };
    }

    return { user };
  } catch {
    return {
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
}

export async function requireStudent(): Promise<
  { user: AuthUser } | { response: NextResponse }
> {
  try {
    const decoded = await isLoggedIn();

    if (typeof decoded !== "object" || !decoded || !("role" in decoded)) {
      return {
        response: NextResponse.json({ message: "Invalid session" }, { status: 401 }),
      };
    }

    const user = decoded as AuthUser;

    if (user.role !== "student") {
      return {
        response: NextResponse.json(
          { message: "Forbidden: only students can perform this action" },
          { status: 403 },
        ),
      };
    }

    return { user };
  } catch {
    return {
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
}
