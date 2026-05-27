"use client";

import { useRouter } from "next/navigation";
import { COLLEGE } from "@/lib/college-brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Meteors } from "@/components/ui/meteors"
export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Grid */}  <Meteors />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl shadow-lg">
            <div className="h-4 w-4 rounded-full bg-[var(--accent)] shadow-[0_0_20px_var(--accent)]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide">
              {COLLEGE.name}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Fine Management Platform
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-10 pb-20">

        {/* Hero */}
        <section className="flex max-w-5xl flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-1.5 backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
              {COLLEGE.tagline}
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-2xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-5xl">
            Modern fine management
            <span className="block font-serif italic text-[var(--accent)]">
              for colleges
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            Handle fines, student clearances, and academic transparency with a
            focused platform designed for speed, simplicity, and clarity.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/login")}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-[var(--accent-foreground)] transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <span className="relative z-10">Login on dashboard</span>

              <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
            </button>
          </div>
        </section>

        {/* Video Section */}
        <section
          id="video"
          className="mt-34 w-full max-w-5xl"
        >
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
              Product Overview
            </p>

            
          </div>

          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="relative aspect-video bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/ZUjiWKKv00o?si=pFATIrZTvSiAyxWE"
                title="Fine Management System overview"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)] w-full">
          <p>
            {COLLEGE.name} • Academic Year {COLLEGE.academicYear}
          </p>
        </footer>
      </main>
    </div>
  );
}