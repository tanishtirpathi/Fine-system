"use client";
import { HexagonPattern } from "@/components/ui/hexagon-pattern"
import type { ReactNode } from "react";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { CollegeLogo } from "./college-shell";
import { cn } from "@/lib/utils";
export function CollegeLoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen 
    bg-[var(--background)]  font-[family-name:var(--font-poppins)] text-[var(--foreground)]">
      <HexagonPattern  radius={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}  />
      <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-4 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shadow-lg">
              <CollegeLogo />
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


        <div className="rounded-2xl p-6 sm:p-8">
          {children}
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          Academic Year {COLLEGE.academicYear} • Authorized students & faculty only
        </p>
      </div>
    </div>
  );
}
