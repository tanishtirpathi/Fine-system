import { getMe } from "@/lib/server/api";
import { CollegeBadge, CollegePanel } from "@/components/college/college-ui";

export default async function TeacherProfilePage() {
  const user = await getMe();

  return (
    <CollegePanel className="mx-auto max-w-2xl">
      <CollegeBadge>Faculty profile</CollegeBadge>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">Account details</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Your verified faculty record on the college fine management portal.
      </p>

      <div className="mt-6 grid gap-4">
        <ProfileCard label="Name" value={user?.user?.name ?? "Teacher"} />
        <ProfileCard label="Role" value={user?.user?.role ?? "teacher"} />
        <ProfileCard label="Department" value={user?.user?.department ?? "General"} />
        <ProfileCard label="Identifier" value={user?.user?.identifier ?? "Not available"} />
      </div>
    </CollegePanel>
  );
}

function ProfileCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--accent)] bg-[var(--surface-muted)] p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-lg font-medium text-[var(--foreground)]">{value}</div>
    </div>
  );
}
