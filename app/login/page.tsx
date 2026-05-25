"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { verifyToken, loginUser } from "@/lib/client/api";
import { CollegeLoginShell } from "@/components/college/college-login-shell";
import { CollegeButton, CollegeInput, CollegeSelect } from "@/components/college/college-ui";

export default function Login() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const data = await verifyToken(token);
        if (data.role === "teacher") {
          router.push("/teacher/dashboard");
        } else if (data.role === "student") {
          router.push("/student/dashboard");
        }
      } catch (checkError) {
        console.error(checkError);
        Cookies.remove("token");
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({ identifier, password, role });

      if (role === "teacher") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } catch (loginError: unknown) {
      setError(loginError instanceof Error ? loginError.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollegeLoginShell>
      {error ? (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm text-[var(--muted)]">
          <span>Sign in as</span>
          <CollegeSelect
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setIdentifier("");
            }}
          >
            <option value="student">Student</option>
            <option value="teacher">Faculty / Teacher</option>
          </CollegeSelect>
        </label>

        <label className="block space-y-2 text-sm text-[var(--muted)]">
          <span>{role === "student" ? "Roll number" : "Faculty email"}</span>
          <CollegeInput
            type={role === "student" ? "text" : "email"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-2 text-sm text-[var(--muted)]">
          <span>Password</span>
          <CollegeInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <CollegeButton type="submit" variant="primary" className="w-full py-3" disabled={loading}>
          {loading ? "Signing in…" : "Sign in securely"}
        </CollegeButton>
      </form>
    </CollegeLoginShell>
  );
}
