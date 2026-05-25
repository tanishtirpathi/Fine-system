"use client";

import { useEffect, useState } from "react";
import type { Student } from "@/types/student.types";
import { updateStudentRecord } from "@/lib/client/api";
import { CollegeButton, CollegeInput, CollegeSelect } from "@/components/college/college-ui";

type StudentEditorModalProps = {
  student: Student;
  onClose: () => void;
  onSaved: (updated: Student) => void;
};

export function StudentEditorModal({ student, onClose, onSaved }: StudentEditorModalProps) {
  const [fineAmount, setFineAmount] = useState(String(student.fineAmount));
  const [fineStatus, setFineStatus] = useState<"paid" | "unpaid">(student.fineStatus);
  const [isCleared, setIsCleared] = useState(student.isCleared ? "true" : "false");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFineAmount(String(student.fineAmount));
    setFineStatus(student.fineStatus);
    setIsCleared(student.isCleared ? "true" : "false");
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
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Fine amount must be a non-negative number.");
      setLoading(false);
      return;
    }

    try {
      const updated = await updateStudentRecord(student.rollNo, {
        fineAmount: Math.round(amount),
        fineStatus,
        isCleared: isCleared === "true",
      });
      onSaved(updated);
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

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
              Faculty record editor
            </p>
            <h2 id="student-editor-title" className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {student.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Roll No: {student.rollNo} • {student.department} • Semester {student.semester}
            </p>
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
            <CollegeSelect value={fineStatus} onChange={(e) => setFineStatus(e.target.value as "paid" | "unpaid")}>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </CollegeSelect>
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Clearance status</span>
            <CollegeSelect value={isCleared} onChange={(e) => setIsCleared(e.target.value)}>
              <option value="true">Cleared</option>
              <option value="false">Pending</option>
            </CollegeSelect>
          </label>

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
