"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { ReactNode } from "react";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { SecureBadge } from "@/components/college/college-ui";


export default function CollegeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] 
    font-[family-name:var(--font-poppins)]">
      <header className="sticky top-3 rounded-lg z-50 border border-[var(--foreground)]/20 mx-10
       bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-3 group transition-all hover:opacity-80"
            >
              <CollegeLogo />
              <div className="flex flex-col justify-center">
                <h1 className="text-lg font-bold font-serif italic text-[var(--foreground)] sm:text-xl leading-none">
                  {COLLEGE.name}
                </h1>
                <p className="text-[10px] text-[var(--muted)] font-sans uppercase tracking-[0.15em] mt-0.5 opacity-70">
                  {COLLEGE.tagline}
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs text-[var(--muted)] sm:inline">
                AY {COLLEGE.academicYear}
              </span>
              <ThemeToggle />
            </div>
          </div>


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
      className="flex shrink-0 items-center justify-center rounded-md border border-[var(--background)]/30
       bg-black shadow-sm overflow-hidden"
    >
      <Image
        src={COLLEGE.logo}
        alt={`${COLLEGE.name} Logo`}
        width={32}
        height={32}
        className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
        priority
      />
    </div>
  );
}
