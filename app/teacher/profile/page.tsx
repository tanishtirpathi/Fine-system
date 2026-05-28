import { getMe } from "@/lib/server/api";
import { CollegeBadge, CollegePanel } from "@/components/college/college-ui";
import { ShieldCheck, Building2, User2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";

export default async function TeacherProfilePage() {
  const user = await getMe();

  const profile = {
    name: user?.user?.name ?? "Teacher",
    role: user?.user?.role ?? "teacher",
    department: user?.user?.department ?? "General",
    identifier: user?.user?.identifier ?? "Not available",
    phoneNo: user?.user?.phoneNo ?? "Not available",
  };

  return (
    <div className=" mx-auto max-w-2xl px-4 py-8">
    <HexagonPattern  radius={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}  />
      <CollegePanel className="relative overflow-hidden
       bg-[var(--surface)]/80 mx-10  backdrop-blur-xl">
           
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-60 w-60 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* Header */}
        <div className="relative flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] shadow-lg">
              <User2 className="h-8 w-8 text-[var(--accent)]" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--muted)]/60">
                Faculty Profile
              </p>

              <h1 className="mt-1 text-3xl font-serif italic tracking-tight text-[var(--foreground)]">
                {profile.name}
              </h1>

      
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
          <ProfileCard
            icon={<User2 className="h-5 w-5" />}
            label="Role"
            value={profile.role}
          />

          <ProfileCard
            icon={<Building2 className="h-5 w-5" />}
            label="Department"
            value={profile.department}
          />

          <ProfileCard
            icon={<Hash className="h-5 w-5" />}
            label="Identifier"
            value={profile.identifier}
            className="sm:col-span-2"
          />
          <ProfileCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="phoneNo"
            value={profile.phoneNo}
          />
          
        </div>
      </CollegePanel>
    </div>
  );
}

function ProfileCard({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)]/60">
            {label}
          </p>

          <h3 className="mt-1 text-lg font-bold text-[var(--foreground)]">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
} 