"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CollegeBadge,
  CollegeButton,
  CollegeInput,
  CollegePanel,
} from "@/components/college/college-ui";

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
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <CollegePanel>
        <CollegeBadge>New enrollment</CollegeBadge>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Register student
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Add a student to the college registry. Semester and fine defaults are applied by the system.
        </p>

        {message ? (
          <div className="mt-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-muted)] px-4 py-3 text-sm text-[var(--accent)]">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Student name" placeholder="Full name" value={form.name} onChange={handleChange("name")} />
          <Field label="Roll number" placeholder="College roll no." value={form.rollNo} onChange={handleChange("rollNo")} />
          <Field
            label="Password"
            type="password"
            placeholder="Portal password"
            value={form.password}
            onChange={handleChange("password")}
          />
          <Field label="Father / guardian contact" placeholder="Phone number" value={form.fatherNo} onChange={handleChange("fatherNo")} />
          <Field label="Department" placeholder="e.g. CSE, BBA" value={form.department} onChange={handleChange("department")} />

          <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
            <CollegeButton type="submit" variant="primary" disabled={loading}>
              {loading ? "Registering…" : "Register student"}
            </CollegeButton>
            <CollegeButton type="button" variant="secondary" onClick={() => router.push("/teacher/dashboard")}>
              Back to dashboard
            </CollegeButton>
          </div>
        </form>
      </CollegePanel>

      <aside className="space-y-6">
        <CollegePanel>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Enrollment policy</h3>
          <div className="mt-4 space-y-3 text-sm">
            <InfoRow title="API route" value="POST /api/signup" />
            <InfoRow title="Semester" value="Default: 1" />
            <InfoRow title="Fine amount" value="Default: ₹0" />
            <InfoRow title="Fine status" value="Unpaid" />
            <InfoRow title="Clearance" value="Pending" />
          </div>
        </CollegePanel>

        <CollegePanel>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Guidelines</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
              Use a unique roll number per student.
            </li>
            <li className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
              Assign department codes consistent with college records.
            </li>
            <li className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
              Update fines and clearance from the faculty dashboard after registration.
            </li>
          </ul>
        </CollegePanel>
      </aside>
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
    <label className="space-y-2 text-sm text-[var(--muted)]">
      <span>{label}</span>
      <CollegeInput type={type} value={value} onChange={onChange} placeholder={placeholder} required />
    </label>
  );
}

function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
      <span className="text-[var(--muted)]">{title}</span>
      <span className="font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}
