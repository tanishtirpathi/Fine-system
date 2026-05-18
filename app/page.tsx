import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background patterns */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,50,0.5),transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12 text-center">
        <header className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
            College Finer
          </h1>
          <div className="space-y-2">
            <p className="text-xl md:text-2xl font-medium text-neutral-400">
              Pay and collect fines with ease
            </p>
            <p className="max-w-xl mx-auto text-sm md:text-base text-neutral-500 leading-relaxed">
              This web app is designed to streamline fine collection and management for colleges,
              ensuring better organization and absolute efficiency.
            </p>
          </div>
        </header>

        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <button className=" cursor-pointer group relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white hover:text-black active:scale-95 shadow-lg shadow-black/20">

            <span className="relative z-10 flex items-center gap-2">
              Login Portal
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>

            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>
          <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-medium">Secure Access</p>
        </div>

        <section className="w-full space-y-8 mt-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral-800"></div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600">Resources</h2>
            <div className="h-px flex-1 bg-neutral-800"></div>
          </div>

          <div className="group relative w-full aspect-video md:aspect-[21/9] rounded-3xl bg-neutral-900 border border-neutral-800/50 overflow-hidden cursor-pointer transition-all hover:border-neutral-700/50">
            <div className="absolute inset-0 bg-neutral-800/20 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>
              <p className="text-sm font-medium text-neutral-400">Watch Demo: How it works</p>
            </div>
          </div>
        </section>
      </div>

      <footer className="fixed bottom-8 text-neutral-700 text-[10px] uppercase tracking-[0.3em]">
        Efficient Management • Transparent Process
      </footer>
    </div>
  );
};

export default HomePage;
