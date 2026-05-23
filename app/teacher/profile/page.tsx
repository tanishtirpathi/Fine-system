import { getMe } from "@/lib/server/api";

export default async function TeacherProfilePage() {
  const user = await getMe();
  console.log("Teacher Profile User:", user.user);

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6">
          <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
            Teacher profile
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white">Your account details</h1>
          <p className="mt-2 text-sm text-slate-400">This page shows the teacher profile pulled from the current session.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          <ProfileCard label="Name" value={user?.user?.name ?? "Teacher"} />
          <ProfileCard label="Role" value={user?.user?.role ?? "teacher"} />
          <ProfileCard label="Department" value={user?.user?.department ?? "General"} />
          <ProfileCard label="Identifier" value={user?.user?.identifier ?? "Not available"} />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-medium text-white">{value}</div>
    </div>
  );
}