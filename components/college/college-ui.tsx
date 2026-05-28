import type { ReactNode } from "react";

export function CollegePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg  p-6 sm:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export function CollegeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 
    bg-[var(--accent-muted)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
      {children}
    </span>
  );
}

export function SecureBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-muted)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
      <LockIcon />
      Secure session
    </span>
  );
}

export function CollegeButton({
  children,
  variant = "secondary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary:
      "border border-[var(--accent)] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
    secondary:
      "border border-[var(--foreground)]/20 bg-[var(--muted)]/20 text-[var(--foreground)] hover:border-[var(--accent)]/50",
    ghost:
      "border border-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function CollegeInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-[var(--muted)]/20 bg-[var(--foreground)]/10 
        px-4 py-3 text-[var(--foreground)] outline-none transition 
        placeholder:text-[var(--muted)] focus:border-[var(--muted)] 
        focus:ring-2 focus:ring-[var(--muted)]/20 ${className}`}
      {...props}
    />
  );
}

export function CollegeSelect({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-xl border border-[var(--muted)]/20 bg-[var(--foreground)]/10
         px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted)] 
         focus:ring-2 focus:ring-[var(--muted)]/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function CollegeStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--foreground)]/20 border-l-4 
    border-l-[var(--foreground)] bg-[var(--muted)]/10 p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">{value}</div>
    </div>
  );
}

export function CollegeChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg border border-[var(--foreground)]/20 bg-[var(--muted)]/20 px-3 py-1 text-sm text-[var(--muted)]">
      {children}
    </span>
  );
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
