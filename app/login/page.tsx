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
  
    <div className="mx-auto w-full max-w-sm z-10">


      <div className="rounded-xl border border-zinc-200 
      bg-white p-6 shadow-sm dark:border-white/20 z-10 dark:bg-black">

        {/* Header */}
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Sign in
          </h1>

          <p className="text-sm text-zinc-500 font-serif italic dark:text-zinc-400">
            Continue to your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-serif italic text-zinc-700 dark:text-zinc-300">
              Role
            </label>

            <CollegeSelect
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIdentifier("");
              }}
              className="h-11 rounded-xl border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 dark:border-zinc-800 dark:bg-black dark:text-white"
            >
              <option value="student">Student</option>
              <option value="teacher">Faculty</option>
            </CollegeSelect>
          </div>

          {/* Identifier */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-serif italic text-zinc-700 dark:text-zinc-300">
              {role === "student" ? "Roll Number" : "Faculty Email"}
            </label>

            <CollegeInput
              type={role === "student" ? "text" : "email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder={
                role === "student"
                  ? "Enter roll number"
                  : "Enter email"
              }
              className="h-11 rounded-xl border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0 dark:border-zinc-800 dark:bg-black dark:text-white"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-serif italic text-zinc-700 dark:text-zinc-300">
              Password
            </label>

            <div className="relative">
              <CollegeInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="h-11 rounded-xl border-zinc-200 bg-white pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0 dark:border-zinc-800 dark:bg-black dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <CollegeButton
            type="submit"
            disabled={loading}
            className="mt-2 h-11 w-full rounded-xl bg-black text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "Signing in..." : "Sign in"}

              {!loading && (
                <ArrowRight className="h-4 w-4" />
              )}
            </span>
          </CollegeButton>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Authorized access only
        </p>
      </div>

    </div>
  </CollegeLoginShell>
);
}