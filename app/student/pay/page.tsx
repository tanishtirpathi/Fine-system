import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	CollegePanel,
} from "@/components/college/college-ui";
import { COLLEGE } from "@/lib/college-brand";
import { ArrowLeft, Phone, ShieldCheck, QrCode } from "lucide-react";

export default async function StudentPayPage() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
			{/* Background */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-white/5 blur-3xl" />
				<div className="absolute bottom-[-140px] right-[-100px] h-[340px] w-[340px] rounded-full bg-white/5 blur-3xl" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
			</div>

			<header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
						<ShieldCheck className="h-5 w-5 text-white" />
					</div>

					<div>
						<p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
							{COLLEGE.shortName} • Secure Portal
						</p>
						<h2 className="text-sm font-semibold sm:text-base">
							{COLLEGE.name}
						</h2>
					</div>
				</div>

				<div className="flex items-center gap-3">
					
					<ThemeToggle />
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:pt-10">
				{/* Left Side */}
				<CollegePanel className="relative flex-1 overflow-hidden  bg-white/[0.03] p-8 backdrop-blur-2xl">
					<div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

					<div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs 
					uppercase tracking-[0.2em] text-zinc-600">
						<QrCode className="h-3.5 w-3.5" />
						Instant QR Payment
					</div>

					<h1 className="mt-6 max-w-2xl text-4xl font-light font-serif italic  leading-tight tracking-tight sm:text-5xl">
						Complete your payment in{" "}
						<span className="text-zinc-400">seconds.</span>
					</h1>

					<p className="mt-5 max-w-xl text-sm leading-7 dark:text-zinc-400 text-black sm:text-base">
						Scan the QR code using any UPI app. After completing the
						payment, call the provided number so the office can verify
						your transaction and update your records instantly.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						<Link
							href="/student/dashboard"
							className="group inline-flex items-center gap-2 rounded-2xl border 
							dark:border-white/10 dark:bg-white bg-black text-sm font-medium dark:text-black text-white transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-200 px-6 py-3"
						>
							<ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
							Back to dashboard
						</Link>

					</div>
				</CollegePanel>

				{/* Right Side */}
				<CollegePanel className="relative w-full max-w-md overflow-hidden border dark:border-white/10 dark:bg-white/[0.03] 
				border-black/10  p-6 backdrop-blur-2xl">
					<div className="absolute inset-x-0 top-0 h-[2px]
					
					dark:bg-gradient-to-r from-transparent via-white/60 to-transparent " />

					<div className="flex flex-col items-center text-center">
						<div className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
							Scan & Pay
						</div>

						<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white p-5 shadow-lg shadow-black/30">
							<div className="absolute inset-0" />

							<Image
								src="/qr/QR.webp"
								alt="Payment QR code"
								width={340}
								height={340}
								priority
								className="relative z-10 h-auto w-full max-w-[320px] rounded-2xl object-contain"
							/>
						</div>

						<div className="mt-6 w-full rounded-2xl border 
						dark:border-white/10 border-black/10 dark:bg-white/5 bg-black/5 p-4 text-left">
							<div className="flex items-center gap-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-xl dark:bg-white bg-black dark:text-black text-white">
									<Phone className="h-5 w-5" />
								</div>

								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
										Verification Contact
									</p>

									<a
										href="tel:+919876543210"
										className="mt-1 block text-lg font-semibold transition hover:text-zinc-300"
									>
										+91 98765 43210
									</a>
								</div>
							</div>
						</div>

						
					</div>
				</CollegePanel>
			</main>
		</div>
	);
}