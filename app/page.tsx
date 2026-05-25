"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";

const FEATURES = [
  {
    title: "Faculty control",
    description: "Teachers manage fines, student records, and bulk clearance from one dashboard.",
  },
  {
    title: "Student transparency",
    description: "Students sign in with roll number to view status and payment obligations.",
  },
  {
    title: "Secure by design",
    description: "Role-based access ensures only authorized faculty can modify records.",
  },
] as const;

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-3xl"
        aria-hidden
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-muted)] text-[var(--accent)]">
            <ShieldIcon />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              {COLLEGE.shortName}
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">{COLLEGE.name}</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-8">
        <section className="mx-auto max-w-2xl">
          <p className="text-sm font-medium text-[var(--accent)]">Academic Year {COLLEGE.academicYear}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {COLLEGE.systemName}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {COLLEGE.tagline}. A focused portal for colleges to record, track, and settle student fines with
            clarity and control.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90 active:scale-[0.98]"
            >
              Sign in to portal
              <ArrowIcon />
            </button>
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--muted)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
            >
              Faculty or student access
            </Link>
          </div>

          <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Encrypted sessions · Role-based permissions
          </div>
        </section>

        <section className="mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center transition hover:border-[var(--accent)]/30"
            >
              <div className="mx-auto mb-4 h-px w-8 bg-[var(--accent)]" />
              <h2 className="text-base font-semibold text-[var(--foreground)]">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{feature.description}</p>
            </article>
          ))}
        </section>
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

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
