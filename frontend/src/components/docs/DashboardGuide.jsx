const DASHBOARD_GUIDE_TEXT = "Command Center gathers synchronized statistics into an AI Executive Telemetry Report powered by Gemini AI.";

export default function DashboardGuide() {
  return (
    <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center gap-4 mb-6 border-b-2 border-black pb-4">
        <span className="text-3xl">✦</span>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          Command Center Overview
        </h3>
      </div>
      <p className="text-sm font-bold text-zinc-600 uppercase tracking-wide leading-relaxed mb-6">
        {DASHBOARD_GUIDE_TEXT}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-black uppercase tracking-wider">
        <div className="border-2 border-black p-4 bg-zinc-50">
          <p className="text-zinc-500 mb-1">Telemetry</p>
          <p className="text-black text-sm">AI Summary Report</p>
        </div>
        <div className="border-2 border-black p-4 bg-zinc-50">
          <p className="text-zinc-500 mb-1">GitHub Sync</p>
          <p className="text-black text-sm">PRs & Commits Stats</p>
        </div>
        <div className="border-2 border-black p-4 bg-zinc-50">
          <p className="text-zinc-500 mb-1">Codeforces Sync</p>
          <p className="text-black text-sm">Solved & Rating Streaks</p>
        </div>
      </div>
    </div>
  );
}
