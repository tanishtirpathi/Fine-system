export default function StudentAddPage() {
  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
          Add student
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white">Student onboarding page</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          This route is ready for your student create form. You can connect it to your student signup API next.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-sm text-slate-300">
          Add fields like name, roll number, father number, department, semester, and initial fine here.
        </div>
      </div>
    </div>
  );
}