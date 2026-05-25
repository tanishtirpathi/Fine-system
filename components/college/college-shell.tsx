"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { SecureBadge } from "@/components/college/college-ui";

const NAV = [
  { href: "/teacher/dashboard", label: "Dashboard" },
  { href: "/teacher/studentadd", label: "Add Student" },
  { href: "/teacher/profile", label: "Profile" },
] as const;

export default function CollegeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[family-name:var(--font-poppins)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="h-1 bg-[var(--accent)]" aria-hidden />

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CollegeLogo />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
                  {COLLEGE.shortName} • Faculty Portal
                </p>
                <h1 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">
                  {COLLEGE.name}
                </h1>
                <p className="text-xs text-[var(--muted)]">{COLLEGE.tagline}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs text-[var(--muted)] sm:inline">
                AY {COLLEGE.academicYear}
              </span>
              <SecureBadge />
              <ThemeToggle />
            </div>
          </div>

          <nav className="flex flex-wrap gap-1 border-t border-[var(--border)] pt-3">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface-muted)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-center text-xs text-[var(--muted)] sm:flex-row sm:justify-between sm:text-left sm:px-6 lg:px-8">
          <span>{COLLEGE.systemName}</span>
          <span>© {new Date().getFullYear()} {COLLEGE.name}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function CollegeLogo() {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)]"
      aria-hidden
    >
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 3L4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
