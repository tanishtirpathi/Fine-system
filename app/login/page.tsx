"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { verifyToken, loginUser } from "@/lib/client/api";

import { CollegeLoginShell } from "@/components/college/college-login-shell";

import {
  CollegeButton,
  CollegeInput,
  CollegeSelect,
} from "@/components/college/college-ui";

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
        } else {
          router.push("/student/dashboard");
        }
      } catch (err) {
        console.error(err);
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
      await loginUser({
        identifier,
        password,
        role,
      });

      router.push(
        role === "teacher"
          ? "/teacher/dashboard"
          : "/student/dashboard"
      );

      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollegeLoginShell>
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
          
          {/* heading */}
          <div className="mb-8">
 

            <h1 className="text-3xl text-center font-semibold tracking-tight text-white">
              Welcome back
            </h1>

          </div>

          {/* error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">
                Role
              </label>

              <CollegeSelect
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setIdentifier("");
                }}
                className="h-12 rounded-2xl border border-white/10 bg-white/5 text-white"
              >
                <option value="student">Student</option>
                <option value="teacher">Faculty / Teacher</option>
              </CollegeSelect>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">
                {role === "student"
                  ? "Roll Number"
                  : "Faculty Email"}
              </label>

              <CollegeInput
                type={role === "student" ? "text" : "email"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="h-12 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">
                Password
              </label>

              <CollegeInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-white/20"
              />
            </div>

            <CollegeButton
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-2xl cursor-pointer bg-white text-black transition-all hover:bg-white/90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </CollegeButton>
          </form>

          {/* footer */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <p className="text-xs text-white/35">
              Authorized students & faculty only
            </p>
          </div>
        </div>
      </div>
    </CollegeLoginShell>
  );
}