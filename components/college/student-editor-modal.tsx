"use client";

import { useEffect, useState } from "react";
import type { Student } from "@/types/student.types";
import { updateStudentRecord } from "@/lib/client/api";
import { CollegeButton, CollegeInput, CollegeSelect } from "@/components/college/college-ui";

type StudentEditorModalProps = {
  student: Student;
  onClose: () => void;
  onSaved: (updated: Student, previousRollNo: string) => void;
};

export function StudentEditorModal({ student, onClose, onSaved }: StudentEditorModalProps) {
  const [name, setName] = useState(student.name);
  const [rollNo, setRollNo] = useState(student.rollNo);
  const [password, setPassword] = useState("");
  const [fatherNo, setFatherNo] = useState(student.fatherNo);
  const [department, setDepartment] = useState(student.department);
  const [semester, setSemester] = useState(String(student.semester));
  const [fineAmount, setFineAmount] = useState(String(student.fineAmount));
  const [fineStatus, setFineStatus] = useState<"paid" | "unpaid">(student.fineStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(student.name);
    setRollNo(student.rollNo);
    setPassword("");
    setFatherNo(student.fatherNo);
    setDepartment(student.department);
    setSemester(String(student.semester));
    setFineAmount(String(student.fineAmount));
    setFineStatus(student.fineStatus);
    setError("");
  }, [student]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const amount = Number(fineAmount);
    const semesterNum = Number(semester);

    if (!name.trim() || !rollNo.trim() || !fatherNo.trim() || !department.trim()) {
      setError("Name, roll number, father contact, and department are required.");
      setLoading(false);
      return;
    }

    if (!Number.isInteger(semesterNum) || semesterNum < 1) {
      setError("Semester must be a positive whole number.");
      setLoading(false);
      return;
    }

    if (!Number.isFinite(amount) || amount < 0) {
      setError("Fine amount must be a non-negative number.");
      setLoading(false);
      return;
    }

    try {
      const { student: updated, previousRollNo } = await updateStudentRecord(student.rollNo, {
        name: name.trim(),
        rollNo: rollNo.trim(),
        fatherNo: fatherNo.trim(),
        department: department.trim(),
        semester: semesterNum,
        fineAmount: Math.round(amount),
        fineStatus,
        ...(password.trim() ? { password: password.trim() } : {}),
      });
      onSaved(updated, previousRollNo);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-editor-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close editor"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
              Edit student record
            </p>
            <h2 id="student-editor-title" className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {student.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Update profile, login, and fine details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--surface-muted)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Full name</span>
            <CollegeInput value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Roll number</span>
            <CollegeInput value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>New password</span>
            <CollegeInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Father / guardian contact</span>
            <CollegeInput value={fatherNo} onChange={(e) => setFatherNo(e.target.value)} required />
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Department</span>
            <CollegeInput value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Semester</span>
            <CollegeInput
              type="number"
              min={1}
              step={1}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            />
          </label>

          <div className="border-t border-[var(--border)] pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Fine details</p>
            <div className="space-y-4">
              <label className="block space-y-2 text-sm text-[var(--muted)]">
                <span>Fine amount (₹)</span>
                <CollegeInput
                  type="number"
                  min={0}
                  step={1}
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  required
                />
              </label>

              <label className="block space-y-2 text-sm text-[var(--muted)]">
                <span>Payment status</span>
                <CollegeSelect
                  value={fineStatus}
                  onChange={(e) => setFineStatus(e.target.value as "paid" | "unpaid")}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </CollegeSelect>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <CollegeButton type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </CollegeButton>
            <CollegeButton type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </CollegeButton>
          </div>
        </form>
      </div>
    </div>
  );
}
