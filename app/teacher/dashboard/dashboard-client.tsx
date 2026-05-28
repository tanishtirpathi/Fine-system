"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Student } from "@/types/student.types";
import { COLLEGE } from "@/lib/college-brand";
import { clearAllStudentFines } from "@/lib/client/api";
import {
  CollegeBadge,
  CollegeButton,
  CollegeChip,
  CollegeInput,
  CollegePanel,
  CollegeSelect,
  CollegeStatCard,
} from "@/components/college/college-ui";
import { StudentEditorModal } from "@/components/college/student-editor-modal";

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

export default function DashboardClient({ user, students: initialStudents }: DashboardClientProps) {
  const router = useRouter();
  const [studentList, setStudentList] = useState(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("all");
  const [department, setDepartment] = useState("all");
  const [fineStatus, setFineStatus] = useState("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  useEffect(() => {
    setStudentList(initialStudents);
  }, [initialStudents]);

  const teacherName = user?.user?.name ?? user?.name ?? "Teacher";
  const teacherDepartment = user?.user?.department ?? user?.department ?? "General";

  const semesters = useMemo(() => {
    return [...new Set(studentList.map((student) => student.semester))].sort((a, b) => a - b);
  }, [studentList]);

  const departments = useMemo(() => {
    return [...new Set(studentList.map((student) => student.department).filter(Boolean))].sort();
  }, [studentList]);

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

  const handleStudentSaved = (updated: Student, previousRollNo: string) => {
    setStudentList((current) =>
      current.map((s) => (s.rollNo === previousRollNo ? { ...s, ...updated } : s)),
    );
    router.refresh();
  };

  const handleAllClear = async () => {
    const confirmed = window.confirm(
      "Clear all fines? Every student will have fine amount ₹0 and paid status.",
    );
    if (!confirmed) return;

    setIsClearingAll(true);
    try {
      const students = await clearAllStudentFines();
      setStudentList(students);
      router.refresh();
    } catch (clearError) {
      alert(clearError instanceof Error ? clearError.message : "Failed to clear all fines");
    } finally {
      setIsClearingAll(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = studentList.filter((student) => {
      const matchesSearch =
        query.length === 0 ||
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query);

      const matchesSemester = semester === "all" || String(student.semester) === semester;
      const matchesDepartment = department === "all" || student.department === department;
      const matchesFineStatus = fineStatus === "all" || student.fineStatus === fineStatus;

      return matchesSearch && matchesSemester && matchesDepartment && matchesFineStatus;
    });

    return filtered.sort((a, b) => b.fineAmount - a.fineAmount);
  }, [search, semester, department, fineStatus, studentList]);

  const totalStudents = studentList.length;
  const unpaidStudents = studentList.filter((student) => student.fineStatus === "unpaid").length;
  const paidStudents = studentList.filter((student) => student.fineStatus === "paid").length;
  const pendingAmount = studentList.reduce((sum, student) => {
    return student.fineStatus === "unpaid" ? sum + student.fineAmount : sum;
  }, 0);

  const topPendingStudents = [...studentList]
    .sort((a, b) => b.fineAmount - a.fineAmount)
    .filter((student) => student.fineAmount > 0)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {editingStudent ? (
        <StudentEditorModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSaved={handleStudentSaved}
        />
      ) : null}

      <CollegePanel>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <CollegeBadge>Faculty dashboard • AY {COLLEGE.academicYear}</CollegeBadge>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Fine management overview
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <CollegeChip>{teacherName}</CollegeChip>
              <CollegeChip>{teacherDepartment}</CollegeChip>
              <CollegeChip>{totalStudents} enrolled</CollegeChip>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <CollegeButton variant="primary" onClick={() => router.push("/teacher/profile")}>
                Profile
              </CollegeButton>
              <CollegeButton variant="primary" onClick={() => router.push("/teacher/studentadd")}>
                Add student
              </CollegeButton>
              <CollegeButton
                variant="secondary"
                onClick={handleAllClear}
                disabled={isClearingAll || totalStudents === 0}
              >
                {isClearingAll ? "Clearing…" : "All clear"}
              </CollegeButton>
              <CollegeButton variant="ghost" onClick={logout} disabled={isLoggingOut}>
                {isLoggingOut ? "Signing out…" : "Sign out"}
              </CollegeButton>
            </div>
          </div>  

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[400px] xl:grid-cols-2">
            <CollegeStatCard label="Pending amount" value={formatCurrency(pendingAmount)} />
            <CollegeStatCard label="Unpaid fines" value={String(unpaidStudents)} />
            <CollegeStatCard label="Paid records" value={String(paidStudents)} />
            <CollegeStatCard label="Active semesters" value={String(semesters.length)} />
          </div>
        </div>
      </CollegePanel>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <CollegePanel className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Student registry</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Sorted by highest fine. Click a name to edit profile and payment details.
              </p>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Showing <span className="font-semibold text-[var(--accent)]">{filteredStudents.length}</span> of{" "}
              {totalStudents}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm text-[var(--muted)] xl:col-span-2">
              <span>Search</span>
              <CollegeInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, roll number, department"
              />
            </label>

            <label className="space-y-2 text-sm text-[var(--muted)]">
              <span>Semester</span>
              <CollegeSelect value={semester} onChange={(event) => setSemester(event.target.value)}>
                <option value="all">All semesters</option>
                {semesters.map((item) => (
                  <option key={item} value={String(item)}>
                    Semester {item}
                  </option>
                ))}
              </CollegeSelect>
            </label>

            <label className="space-y-2 text-sm text-[var(--muted)]">
              <span>Department</span>
              <CollegeSelect value={department} onChange={(event) => setDepartment(event.target.value)}>
                <option value="all">All departments</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </CollegeSelect>
            </label>

            <label className="space-y-2 text-sm text-[var(--muted)] md:col-span-2 xl:col-span-4">
              <span>Fine status</span>
              <CollegeSelect value={fineStatus} onChange={(event) => setFineStatus(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </CollegeSelect>
            </label>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--muted)]/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--foreground)]/40">
                <thead className="bg-[var(--muted)]/20 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Semester</th>
                    <th className="px-4 py-3">Fine</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)] text-sm">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const displayStatus =
                        student.fineAmount === 0 ? "paid" : student.fineStatus;

                      return (
                        <tr key={student.rollNo} className="transition hover:bg-[var(--muted)]/20">
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => setEditingStudent(student)}
                              className="group text-left"
                            >
                              <div className="font-medium text-[var(--foreground)] underline-offset-2 group-hover:text-[var(--accent)] group-hover:underline">
                                {student.name}
                              </div>
                              <div className="text-xs text-[var(--muted)]">Roll No: {student.rollNo}</div>
                            </button>
                          </td>
                          <td className="px-4 py-4 text-[var(--muted)]">{student.department}</td>
                          <td className="px-4 py-4 text-[var(--muted)]">Semester {student.semester}</td>
                          <td className="px-4 py-4 font-medium tabular-nums text-[var(--foreground)]">
                            {formatCurrency(student.fineAmount)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge tone={displayStatus === "paid" ? "success" : "warning"}>
                              {displayStatus}
                            </StatusBadge>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-14 text-center text-[var(--muted)]">
                        No students match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CollegePanel>

        <aside className="space-y-6">
          <CollegePanel>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">College summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <InsightRow label="Total students" value={String(totalStudents)} />
              <InsightRow label="Pending fines" value={String(unpaidStudents)} />
              <InsightRow label="Paid records" value={String(paidStudents)} />
              <InsightRow label="Departments" value={String(departments.length)} />
            </div>
          </CollegePanel>

          <CollegePanel>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Highest outstanding fines</h3>
            <div className="mt-4 space-y-4">
              {topPendingStudents.length > 0 ? (
                topPendingStudents.map((student) => (
                  <div
                    key={student.rollNo}
                    className="rounded-xl border border-[var(--muted)]/20 bg-[var(--foreground)]/10 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(student)}
                        className="text-left hover:text-[var(--accent)]"
                      >
                        <div className="font-medium font-serif italic text-[var(--foreground)]">{student.name}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {student.department} • Semester {student.semester}
                        </div>
                      </button>
                      <div className="text-right text-sm font-semibold tabular-nums text-[var(--accent)]">
                        {formatCurrency(student.fineAmount)}
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--foreground)]/20">
                      <div
                        className="h-full rounded-full bg-[var(--foreground)]"
                        style={{ width: `${Math.min(100, Math.max(12, student.fineAmount / 10))}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No outstanding fines.</p>
              )}
            </div>
          </CollegePanel>
        </aside>
      </section>
    </div>
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "neutral";
  children: ReactNode;
}) {
  const styles = {
    success: "border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)]",
    warning: "border-[var(--warning)]/30 bg-[var(--warning-muted)] text-[var(--warning)]",
    neutral: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${styles[tone]}`}>
      {children}
    </span>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--muted)]/20
     bg-[var(--muted)]/30 px-4 py-3">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}
