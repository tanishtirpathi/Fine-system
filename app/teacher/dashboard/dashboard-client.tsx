"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Student } from "@/types/student.types";

type TeacherPayload = {
  user?: {
    name?: string;
    department?: string;
    role?: string;
  };
  name?: string;
  department?: string;
  role?: string;
};

type DashboardClientProps = {
  user: TeacherPayload | null;
  students: Student[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardClient({ user, students }: DashboardClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("all");
  const [department, setDepartment] = useState("all");
  const [fineStatus, setFineStatus] = useState("all");
  const [cleared, setCleared] = useState("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const teacherName = user?.user?.name ?? user?.name ?? "Teacher";
  const teacherDepartment = user?.user?.department ?? user?.department ?? "General";

  const semesters = useMemo(() => {
    return [...new Set(students.map((student) => student.semester))].sort((a, b) => a - b);
  }, [students]);

  const departments = useMemo(() => {
    return [...new Set(students.map((student) => student.department).filter(Boolean))].sort();
  }, [students]);

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

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        query.length === 0 ||
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query);

      const matchesSemester = semester === "all" || String(student.semester) === semester;
      const matchesDepartment = department === "all" || student.department === department;
      const matchesFineStatus = fineStatus === "all" || student.fineStatus === fineStatus;
      const matchesCleared =
        cleared === "all" ||
        (cleared === "cleared" && student.isCleared) ||
        (cleared === "pending" && !student.isCleared);

      return (
        matchesSearch &&
        matchesSemester &&
        matchesDepartment &&
        matchesFineStatus &&
        matchesCleared
      );
    });
  }, [search, semester, department, fineStatus, cleared, students]);

  const totalStudents = students.length;
  const unpaidStudents = students.filter((student) => student.fineStatus === "unpaid").length;
  const clearedStudents = students.filter((student) => student.isCleared).length;
  const pendingAmount = students.reduce((sum, student) => {
    return student.fineStatus === "unpaid" ? sum + student.fineAmount : sum;
  }, 0);

  const topPendingStudents = [...students]
    .filter((student) => student.fineAmount > 0)
    .sort((a, b) => b.fineAmount - a.fineAmount)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.24),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#0b1020_0%,_#050816_55%,_#02040c_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
                  Teacher dashboard
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                    Fine management control center
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    Track student fines, filter by semester or department, and review payment status from one dark command panel.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {teacherName}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {teacherDepartment}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {totalStudents} students loaded
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => router.push("/teacher/profile")}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/teacher/studentadd")}
                    className="rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/25"
                  >
                    Add Student
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    disabled={isLoggingOut}
                    className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:grid-cols-2">
                <StatCard label="Pending amount" value={formatCurrency(pendingAmount)} accent="from-cyan-400 to-blue-500" />
                <StatCard label="Unpaid fines" value={String(unpaidStudents)} accent="from-rose-400 to-orange-500" />
                <StatCard label="Cleared students" value={String(clearedStudents)} accent="from-emerald-400 to-teal-500" />
                <StatCard label="Semester count" value={String(semesters.length)} accent="from-violet-400 to-fuchsia-500" />
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Student filters</h2>
                  <p className="mt-1 text-sm text-slate-400">Search and narrow the list without leaving the dashboard.</p>
                </div>

                <div className="text-sm text-slate-400">
                  Showing <span className="font-semibold text-white">{filteredStudents.length}</span> of {totalStudents}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-2 text-sm text-slate-300 xl:col-span-2">
                  <span>Search</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, roll number, department"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Semester</span>
                  <select
                    value={semester}
                    onChange={(event) => setSemester(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    <option value="all">All semesters</option>
                    {semesters.map((item) => (
                      <option key={item} value={String(item)}>
                        Semester {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Department</span>
                  <select
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    <option value="all">All departments</option>
                    {departments.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Fine status</span>
                  <select
                    value={fineStatus}
                    onChange={(event) => setFineStatus(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Clearance</span>
                  <select
                    value={cleared}
                    onChange={(event) => setCleared(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    <option value="all">All students</option>
                    <option value="cleared">Cleared</option>
                    <option value="pending">Pending</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-4 py-4 font-medium">Student</th>
                        <th className="px-4 py-4 font-medium">Department</th>
                        <th className="px-4 py-4 font-medium">Semester</th>
                        <th className="px-4 py-4 font-medium">Fine</th>
                        <th className="px-4 py-4 font-medium">Status</th>
                        <th className="px-4 py-4 font-medium">Clearance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#07101f]/90 text-sm">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.rollNo} className="transition hover:bg-white/5">
                            {(() => {
                              const resolvedFineStatus = student.fineAmount === 0 ? "paid" : student.fineStatus;
                              const resolvedCleared = student.fineAmount === 0 ? true : student.isCleared;

                              return (
                                <>
                            <td className="px-4 py-4">
                              <div className="font-medium text-white">{student.name}</div>
                              <div className="text-xs text-slate-400">Roll No: {student.rollNo}</div>
                            </td>
                            <td className="px-4 py-4 text-slate-300">{student.department}</td>
                            <td className="px-4 py-4 text-slate-300">Semester {student.semester}</td>
                            <td className="px-4 py-4 font-medium text-white">{formatCurrency(student.fineAmount)}</td>
                            <td className="px-4 py-4">
                              <StatusBadge tone={resolvedFineStatus === "paid" ? "green" : "amber"}>
                                {resolvedFineStatus}
                              </StatusBadge>
                            </td>
                            <td className="px-4 py-4">
                              <StatusBadge tone={resolvedCleared ? "green" : "slate"}>
                                {resolvedCleared ? "cleared" : "pending"}
                              </StatusBadge>
                            </td>
                                </>
                              );
                            })()}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-14 text-center text-slate-400">
                            No students match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">Quick insights</h3>
                <div className="mt-5 space-y-4 text-sm text-slate-300">
                  <InsightRow label="Total students" value={String(totalStudents)} />
                  <InsightRow label="Pending fines" value={String(unpaidStudents)} />
                  <InsightRow label="Cleared records" value={String(clearedStudents)} />
                  <InsightRow label="Departments" value={String(departments.length)} />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">Highest fines</h3>
                <div className="mt-5 space-y-4">
                  {topPendingStudents.length > 0 ? (
                    topPendingStudents.map((student) => (
                      <div key={student.rollNo} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-white">{student.name}</div>
                            <div className="text-xs text-slate-400">{student.department} • Semester {student.semester}</div>
                          </div>
                          <div className="text-right text-sm font-semibold text-cyan-300">
                            {formatCurrency(student.fineAmount)}
                          </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                            style={{ width: `${Math.min(100, Math.max(12, student.fineAmount / 10))}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No fine records yet.</p>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${accent}`} />
      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function StatusBadge({ tone, children }: { tone: "green" | "amber" | "slate"; children: ReactNode }) {
  const styles =
    tone === "green"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      : tone === "amber"
        ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
        : "border-slate-400/20 bg-slate-400/10 text-slate-200";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${styles}`}>{children}</span>;
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}