"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  rollNo: string;
  password: string;
  fatherNo: string;
  department: string;
};

const initialState: FormState = {
  name: "",
  rollNo: "",
  password: "",
  fatherNo: "",
  department: "",
};

export default function StudentAddPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to create student");
      }
      setMessage(result?.message ?? "Student created successfully");
      setForm(initialState);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
            Add student
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Create a new student record</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Teachers can add students directly from this page. The form uses your existing signup API, and the backend will set the initial semester and fine defaults.
          </p>

          {message ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <Field label="Student name" placeholder="Enter full name" value={form.name} onChange={handleChange("name")} />
            <Field label="Roll number" placeholder="Enter roll number" value={form.rollNo} onChange={handleChange("rollNo")} />
            <Field label="Password" type="password" placeholder="Set login password" value={form.password} onChange={handleChange("password")} />
            <Field label="Father number" placeholder="Enter father contact" value={form.fatherNo} onChange={handleChange("fatherNo")} />
            <Field label="Department" placeholder="Ex: CSE, BBA, English" value={form.department} onChange={handleChange("department")} />

            <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating student..." : "Create student"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/teacher/dashboard")}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Back to dashboard
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">What happens on submit</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <InfoRow title="API route" value="POST /api/signup" />
              <InfoRow title="Semester" value="Defaulted to 1 by backend" />
              <InfoRow title="Fine amount" value="Defaulted to 0 by backend" />
              <InfoRow title="Fine status" value="Starts as unpaid" />
              <InfoRow title="Clearance" value="Starts as false" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Teacher notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Use a unique roll number for each student.</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Keep the password simple enough for first login, then let them change it later.</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">You can update fine and clearance from the dashboard after creation.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="space-y-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
      />
    </label>
  );
}

function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-slate-400">{title}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}