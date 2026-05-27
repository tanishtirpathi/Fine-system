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

import {
  ShieldCheck,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative mx-auto w-full max-w-md">
        {/* glow */}
        <div className="absolute inset-0 -z-10 rounded-[40px] bg-white/5 blur-3xl" />

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-2xl dark:bg-white/80">

          {/* heading */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-white dark:text-black">
              Welcome back
            </h1>
          </div>

          {/* error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 dark:text-red-600">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* role */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/60 dark:text-black/60">
                Select Role
              </label>

              <CollegeSelect
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setIdentifier("");
                }}
                className="h-13 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white backdrop-blur-xl transition-all focus:border-white/20 focus:ring-0 dark:border-black/10 dark:bg-black/5 dark:text-black"
              >
                <option value="student">Student</option>
                <option value="teacher">Faculty / Teacher</option>
              </CollegeSelect>
            </div>

            {/* identifier */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/60 dark:text-black/60">
                {role === "student"
                  ? "Roll Number"
                  : "Faculty Email"}
              </label>

              <CollegeInput
                type={role === "student" ? "text" : "email"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder={
                  role === "student"
                    ? "Enter your roll number"
                    : "Enter your email"
                }
                className="h-13 rounded-2xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/25 transition-all focus:border-white/20 focus:ring-0 dark:border-black/10 dark:bg-black/5 dark:text-black dark:placeholder:text-black/30"
              />
            </div>

            {/* password */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/60 dark:text-black/60">
                Password
              </label>

              <div className="relative">
                <CollegeInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-13 rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-white placeholder:text-white/25 transition-all focus:border-white/20 focus:ring-0 dark:border-black/10 dark:bg-black/5 dark:text-black dark:placeholder:text-black/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white dark:text-black/40 dark:hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* submit */}
            <CollegeButton
              type="submit"
              disabled={loading}
              className="group mt-3 h-13 w-full rounded-2xl bg-white text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </CollegeButton>
          </form>

          {/* footer */}
          <div className="mt-8 border-t border-white/10 pt-5 text-center dark:border-black/10">
            <p className="text-xs tracking-wide text-white/30 dark:text-black/35">
              Authorized students & faculty only
            </p>
          </div>
        </div>
      </div>
    </CollegeLoginShell>
  );
}