import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	CollegeBadge,
	CollegePanel,
	SecureBadge,
} from "@/components/college/college-ui";
import { COLLEGE } from "@/lib/college-brand";
import { getMe } from "@/lib/server/api";

export default async function StudentPayPage() {
	try {
		await getMe();
	} catch {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			<header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-muted)] text-[var(--accent)]">
						<ShieldIcon />
					</div>
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
							{COLLEGE.shortName} • Student
						</p>
						<p className="text-sm font-semibold">{COLLEGE.name}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<SecureBadge />
					<ThemeToggle />
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:pt-10">
				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<CollegePanel className="relative overflow-hidden">
						<div
							className="pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-40"
							aria-hidden
							style={{
								background:
									"radial-gradient(circle at top right, var(--accent-muted), transparent 45%), radial-gradient(circle at bottom left, color-mix(in srgb, var(--accent) 14%, transparent), transparent 40%)",
							}}
						/>

						<CollegeBadge>Student fine payment</CollegeBadge>
						<h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
							Scan the QR and finish your payment
						</h1>
						<p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
							Use the QR image on this page to complete the fine payment, then call this number after
							payment so the office can verify your receipt.
						</p>

						<div className="mt-8 grid gap-4 sm:grid-cols-2">
							<InfoCard label="Payment note" value="Keep the transaction ID ready" />
							<InfoCard label="After payment" value="Call +91 98765 43210" />
						</div>

						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Link
								href="/student/dashboard"
								className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/50"
							>
								Back to dashboard
							</Link>
						</div>
					</CollegePanel>

					<CollegePanel className="flex flex-col items-center justify-center gap-6 text-center">
						<div className="space-y-2">
							<CollegeBadge>QR image</CollegeBadge>
						</div>

						<div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 shadow-sm shadow-black/5 dark:shadow-black/20">
							<div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" aria-hidden />
							<div className="flex items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4">
								<Image
									src="/qr/QR.webp"
									alt="Payment QR code"
									width={320}
									height={320}
									className="h-auto w-full max-w-[320px] rounded-xl object-contain"
									priority
								/>
							</div>
						</div>

						<div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]">
							Call this number after payment: <a href="tel:+919876543210" className="font-semibold text-[var(--accent)] hover:underline">+91 98765 43210</a>
						</div>
					</CollegePanel>
				</div>
			</main>
		</div>
	);
}

function InfoCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
			<div className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{label}</div>
			<div className="mt-2 text-sm font-medium text-[var(--foreground)]">{value}</div>
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
