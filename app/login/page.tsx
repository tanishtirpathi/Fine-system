"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { verifyToken, loginUser } from "@/lib/client/api";

export default function Login() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // CHECK USER LOGIN
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
      } catch (error) {
        console.error(error);
        Cookies.remove("token");
      }
    };

    checkUser();
  }, [router]);

  // HANDLE LOGIN
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

      alert("Login successful!");

      if (role === "teacher") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-lg shadow-md">
        
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* ROLE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIdentifier("");
              }}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* IDENTIFIER */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {role === "student"
                ? "Roll Number"
                : "Email Address"}
            </label>

            <input
              type={role === "student" ? "text" : "email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}