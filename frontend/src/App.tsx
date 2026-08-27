import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="max-w-xl w-full border border-slate-800 bg-slate-900 rounded-xl p-8 shadow-2xl text-center space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-sky-400">ForgeERP</h1>
        <p className="text-slate-400 text-sm">
          Next-Generation Enterprise Resource Planning System for Manufacturing Companies
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Monorepo Environment Ready
        </div>
      </div>
    </div>
  );
}
