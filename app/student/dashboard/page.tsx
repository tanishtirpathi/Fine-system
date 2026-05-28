"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Student } from "@/types/student.types";
import { getStudentDashboard } from "@/lib/client/api";
import { COLLEGE } from "@/lib/college-brand";
import { HexagonPattern } from "@/components/ui/hexagon-pattern"
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CollegePanel,
  CollegeInput,
  CollegeSelect,
  CollegeButton,
} from "@/components/college/college-ui";
import { CollegeLogo } from "@/components/college/college-shell";

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

      router.push("/");
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

  const teacherNameOrDash = (name?: string | null) => (name && name.trim() ? name : "—");

  return (
    <div className="min-h-screen mx-15 bg-[var(--background)] text-[var(--foreground)]">
      <HexagonPattern radius={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )} />      <header className="sticky top-0 z-40  border-[var(--foreground)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--foreground)]/10 
          dark:bg-white/10 bg-black/10 px-4 py-2 shadow-sm shadow-black/5 dark:shadow-black/20 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center shadow-lg">
                  <CollegeLogo />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{COLLEGE.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  href="/student/pay"
                  className="inline-flex items-center gap-2 rounded-md border
                   border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 text-sm
                    font-medium text-[var(--background)] transition hover:opacity-90"
                >
                  <PayIcon />
                  Pay fine
                </Link>
                <CollegeButton variant="primary" onClick={logout} disabled={isLoggingOut}>
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </CollegeButton>
                <ThemeToggle />

              </div>
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
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6">
                  <div>
                    <h1 className="font-serif text-4xl italic font-light tracking-tight text-[var(--foreground)] sm:text-5xl">
                      {me ? me.name : "Student"}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                    <div className="group space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]/50 transition-colors group-hover:text-[var(--accent)]">Roll Number</p>
                      <p className="font-main text-sm font-bold tracking-wide">{me?.rollNo ?? "—"}</p>
                    </div>
                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />
                    <div className="group space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]/50 transition-colors group-hover:text-[var(--accent)]">Department</p>
                      <p className="font-main text-sm font-bold tracking-wide">{me?.department ?? "—"}</p>
                    </div>
                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />
                    <div className="group space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]/50 transition-colors
                       group-hover:text-[var(--accent)]">Current Term</p>
                      <p className="font-main text-sm font-bold tracking-wide">{me?.semester ? `Semester ${me.semester}` : "—"}</p>
                    </div>
                  </div>
                </div>

                {me ? (
                  <div className="relative overflow-hidden rounded-3xl  p-6 sm:p-8 lg:min-w-[320px]">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full " />
                    <div className="flex flex-col items-start gap-4 sm:items-end">
                      <div className="space-y-1 sm:text-right">
                        <div className="text-5xl font-bold tracking-tighter tabular-nums text-[var(--accent)] sm:text-6xl">
                          {formatCurrency(me.fineAmount)}
                        </div>
                      </div>

                      <FineStatusBadge fineStatus={me.fineStatus} />

                      <div className="mt-2 h-px w-full bg-[var(--border)]/50" />


                    </div>
                  </div>
                ) : null}
              </div>
            </CollegePanel>

            <CollegePanel className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Other students’ fines</h2>
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

              <div className="mt-6 overflow-hidden rounded-xl border border-[var(--foreground)]/20">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-black/10 dark:divide-white/10">
                    <thead className="dark:bg-white/20 bg-gray-200 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Fine</th>
                        <th className="px-4 py-3">Teacher</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y  divide-black/10 dark:divide-white/10 bg-gray-100 dark:bg-gray-900/20 text-sm">
                      {filtered.length > 0 ? (
                        filtered.map((s) => (
                          <tr key={s.rollNo} >
                            <td className="px-4 py-4">
                              <div className="font-medium text-[var(--foreground)]">{s.name}</div>
                              <div className="mt-1 text-xs text-[var(--muted)]">
                                {s.rollNo} • {s.department} • Sem {s.semester}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-semibold tabular-nums text-[var(--foreground)]">
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
                                    className="text-[var(--foreground)]/40 hover:underline"
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

