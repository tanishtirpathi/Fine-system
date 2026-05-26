"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Student } from "@/types/student.types";
import { getStudentDashboard } from "@/lib/client/api";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CollegeBadge,
  CollegePanel,
  CollegeInput,
  CollegeSelect,
  CollegeButton,
} from "@/components/college/college-ui";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function toneForFineStatus(fineStatus: Student["fineStatus"]) {
  return fineStatus === "paid" ? ("success" as const) : ("warning" as const);
}

function FineStatusBadge({ fineStatus }: { fineStatus: Student["fineStatus"] }) {
  const tone = toneForFineStatus(fineStatus);
  const styles: Record<typeof tone, { cls: string }> = {
    success: { cls: "border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)]" },
    warning: { cls: "border-[var(--warning)]/30 bg-[var(--warning-muted)] text-[var(--warning)]" },
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${styles[tone].cls}`}
    >
      {fineStatus}
    </span>
  );
}

export default function StudentDashboardPage() {
    const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [me, setMe] = useState<Student | null>(null);
  const [query, setQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [department, setDepartment] = useState("all");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await getStudentDashboard();
        if (!alive) return;
        setStudents(res.students);
        setMe(res.me);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

   const logout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };
  const departments = useMemo(() => {
    return [...new Set(students.map((s) => s.department).filter(Boolean))].sort();
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students
      .filter((s) => (department === "all" ? true : s.department === department))
      .filter((s) => {
        if (q.length === 0) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.fineAmount - a.fineAmount);
  }, [students, query, department]);

  const phoneOrDash = (phone?: string | null) => (phone && phone.trim() ? phone : "—");
  const teacherNameOrDash = (name?: string | null) => (name && name.trim() ? name : "—");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm shadow-black/5 dark:shadow-black/20 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-muted)] text-[var(--accent)]">
                  <ShieldIcon />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                    {COLLEGE.shortName} • Student
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{COLLEGE.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Link
                  href="/student/pay"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90"
                >
                  <PayIcon />
                  Pay fine
                </Link>
                <CollegeButton variant="ghost" onClick={logout} disabled={isLoggingOut}>
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </CollegeButton>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
              <Link
                href="/student/dashboard"
                className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-muted)] px-3.5 py-1.5 text-xs font-medium text-[var(--accent)]"
              >
                Dashboard
              </Link>
              <Link
                href="/student/pay"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
              >
                Pay fine
              </Link>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-1.5 text-xs text-[var(--muted)]">
                View fines and payment status
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        {loading ? (
          <div className="mt-10 text-sm text-[var(--muted)]">Loading dashboard…</div>
        ) : error ? (
          <div className="mt-10 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <CollegePanel>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CollegeBadge>Your fines & teacher contact</CollegeBadge>
                  <h1 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
                    {me ? me.name : "Student"}
                  </h1>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Roll No: {me?.rollNo ?? "—"} • Department: {me?.department ?? "—"} • Semester{" "}
                    {me?.semester ?? "—"}
                  </p>
                </div>

                {me ? (
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="text-3xl font-semibold tabular-nums text-[var(--accent)]">
                      {formatCurrency(me.fineAmount)}
                    </div>
                    <FineStatusBadge fineStatus={me.fineStatus} />
                    <div className="text-sm text-[var(--muted)]">
                      Teacher: {teacherNameOrDash(me.updatedByTeacherName)} •{" "}
                      {me.updatedByTeacherPhoneNo ? (
                        <a
                          className="text-[var(--accent)] hover:underline"
                          href={`tel:${me.updatedByTeacherPhoneNo}`}
                        >
                          {phoneOrDash(me.updatedByTeacherPhoneNo)}
                        </a>
                      ) : (
                        <>Phone: {phoneOrDash(me.updatedByTeacherPhoneNo)}</>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </CollegePanel>

            <CollegePanel className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Other students’ fines</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">Read-only. Sorted by highest fine first.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <label className="space-y-2 text-sm text-[var(--muted)]">
                    <span>Search</span>
                    <CollegeInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name / roll no / department" />
                  </label>

                  <label className="space-y-2 text-sm text-[var(--muted)]">
                    <span>Department</span>
                    <CollegeSelect value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option value="all">All</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </CollegeSelect>
                  </label>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border)]">
                    <thead className="bg-[var(--surface-muted)] text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Fine</th>
                        <th className="px-4 py-3">Teacher</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)] text-sm">
                      {filtered.length > 0 ? (
                        filtered.map((s) => (
                          <tr key={s.rollNo} className="transition hover:bg-[var(--surface-muted)]">
                            <td className="px-4 py-4">
                              <div className="font-medium text-[var(--foreground)]">{s.name}</div>
                              <div className="mt-1 text-xs text-[var(--muted)]">
                                {s.rollNo} • {s.department} • Sem {s.semester}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-semibold tabular-nums text-[var(--accent)]">
                                {formatCurrency(s.fineAmount)}
                              </div>
                              <div className="mt-2">
                                <FineStatusBadge fineStatus={s.fineStatus} />
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-[var(--foreground)]">
                                {teacherNameOrDash(s.updatedByTeacherName)}
                              </div>
                              <div className="mt-1 text-xs text-[var(--muted)]">
                                {s.updatedByTeacherPhoneNo ? (
                                  <a
                                    className="text-[var(--accent)] hover:underline"
                                    href={`tel:${s.updatedByTeacherPhoneNo}`}
                                  >
                                    {s.updatedByTeacherPhoneNo}
                                  </a>
                                ) : (
                                  <>Phone: —</>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-14 text-center text-[var(--muted)]">
                            No students match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollegePanel>
          </div>
        )}
      </main>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 3L4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PayIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M8 9.5C8 7.57 9.79 6 12 6s4 1.57 4 3.5S14.21 13 12 13s-4 1.57-4 3.5S9.79 20 12 20s4-1.57 4-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

