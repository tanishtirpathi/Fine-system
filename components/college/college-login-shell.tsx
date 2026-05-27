"use client";

import type { ReactNode } from "react";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";
export function CollegeLoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] font-[family-name:var(--font-poppins)] text-[var(--foreground)]">

      <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 3L4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4z" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
                {COLLEGE.shortName}
              </p>
              <p className="font-semibold text-[var(--foreground)]">{COLLEGE.name}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/25 sm:p-8">
          {children}
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          Academic Year {COLLEGE.academicYear} • Authorized students & faculty only
        </p>
      </div>
    </div>
  );
}
