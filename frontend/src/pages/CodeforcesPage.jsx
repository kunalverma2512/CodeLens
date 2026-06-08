import { useState } from "react";
import { useCodeforces } from "../hooks/useCodeforces";
import VerifyModal from "../components/codeforces/VerifyModal";

// ── Rank colour helper ───────────────────────────────────────────────────────
const RANK_COLORS = {
  legendary: "text-red-600",
  "international grandmaster": "text-red-500",
  grandmaster: "text-red-400",
  "international master": "text-orange-500",
  master: "text-orange-400",
  "candidate master": "text-purple-600",
  expert: "text-blue-600",
  specialist: "text-cyan-600",
  pupil: "text-green-600",
  newbie: "text-gray-600",
  unrated: "text-gray-400",
};

const rankColor = (rank = "") =>
  RANK_COLORS[rank.toLowerCase()] || "text-black";

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="border-[4px] border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] bg-white flex flex-col justify-between h-full">
      <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{label}</span>
      <span className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">{value ?? "—"}</span>
      {sub && <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">{sub}</span>}
    </div>
  );
}

/** Heatmap: renders a 52-week grid from dailyActivity map */
function ActivityHeatmap({ dailyActivity = {} }) {
  const today = new Date();
  const weeks = [];

  // Build 52 weeks × 7 days
  for (let w = 51; w >= 0; w--) {
    const week = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + d));
      const key = date.toISOString().slice(0, 10);
      week.push({ key, count: dailyActivity[key] || 0 });
    }
    weeks.push(week);
  }

  const getIntensity = (count) => {
    if (count === 0) return "bg-gray-100 border-gray-200";
    if (count <= 2)  return "bg-gray-400 border-gray-500";
    if (count <= 5)  return "bg-gray-600 border-gray-700";
    if (count <= 10) return "bg-gray-800 border-gray-900";
    return "bg-black border-black";
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map(({ key, count }) => (
                <div
                  key={key}
                  title={`${key}: ${count} submission${count !== 1 ? "s" : ""}`}
                  className={`w-3 h-3 border ${getIntensity(count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Less</span>
        {["bg-gray-100","bg-gray-400","bg-gray-600","bg-gray-800","bg-black"].map((c,i) => (
          <div key={i} className={`w-3 h-3 border border-black ${c}`} />
        ))}
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">More</span>
      </div>
    </div>
  );
}

/** Simple SVG line chart for rating history */
function RatingChart({ history = [] }) {
  if (!history.length) return (
    <div className="border-[4px] border-black p-8 text-center">
      <p className="font-black uppercase tracking-widest text-gray-400">No contest history yet.</p>
    </div>
  );

  const W = 800, H = 260, PAD = 40;
  const ratings = history.map(h => h.newRating);
  const minR = Math.min(...ratings) - 50;
  const maxR = Math.max(...ratings) + 50;

  const toX = (i) => PAD + (i / (history.length - 1)) * (W - 2 * PAD);
  const toY = (r) => H - PAD - ((r - minR) / (maxR - minR)) * (H - 2 * PAD);

  const points = history.map((h, i) => `${toX(i)},${toY(h.newRating)}`).join(" ");

  // Draw coloured band zones
  const zones = [
    { maxR: 1200, color: "#e5e5e5", label: "Newbie" },
    { maxR: 1400, color: "#d4edda", label: "Pupil" },
    { maxR: 1600, color: "#cce5ff", label: "Specialist" },
    { maxR: 1900, color: "#d6d6ff", label: "Expert" },
    { maxR: 2100, color: "#ffe8cc", label: "CM" },
    { maxR: 2400, color: "#ffd6d6", label: "Master" },
    { maxR: Infinity, color: "#ffb3b3", label: "GM+" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = PAD + t * (H - 2 * PAD);
          const r = Math.round(maxR - t * (maxR - minR));
          return (
            <g key={i}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#e5e5e5" strokeWidth="1" />
              <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#999" fontFamily="monospace">{r}</text>
            </g>
          );
        })}

        {/* Rating line */}
        <polyline
          points={points}
          fill="none"
          stroke="black"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {history.map((h, i) => (
          <circle
            key={i}
            cx={toX(i)}
            cy={toY(h.newRating)}
            r="4"
            fill="black"
            className="cursor-pointer"
          >
            <title>{h.contestName}: {h.oldRating} → {h.newRating} (#{h.rank})</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

/** Top tags bar chart */
function TagsChart({ byTag = {} }) {
  const sorted = Object.entries(byTag).sort((a, b) => b[1] - a[1]).slice(0, 12);
  if (!sorted.length) return null;
  const max = sorted[0][1];

  return (
    <div className="space-y-3">
      {sorted.map(([tag, count]) => (
        <div key={tag} className="flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest w-36 flex-shrink-0 text-right text-gray-700">
            {tag}
          </span>
          <div className="flex-1 bg-gray-100 border-[2px] border-black h-6 relative">
            <div
              className="bg-black h-full transition-all duration-700"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black w-8 text-gray-700">{count}</span>
        </div>
      ))}
    </div>
  );
}

/** Recent submissions table */
function SubmissionsTable({ submissions = [] }) {
  const verdictStyle = (v) => {
    if (v === "OK") return "bg-black text-white";
    if (v === "WRONG_ANSWER") return "bg-gray-800 text-white";
    if (v === "TIME_LIMIT_EXCEEDED") return "bg-gray-600 text-white";
    return "bg-gray-300 text-black";
  };
  const verdictLabel = (v) => {
    const map = {
      OK: "AC",
      WRONG_ANSWER: "WA",
      TIME_LIMIT_EXCEEDED: "TLE",
      RUNTIME_ERROR: "RTE",
      COMPILATION_ERROR: "CE",
      MEMORY_LIMIT_EXCEEDED: "MLE",
    };
    return map[v] || v?.slice(0, 6) || "?";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b-[4px] border-black">
            {["#","Problem","Rating","Tags","Language","Verdict","Time"].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submissions.slice(0, 25).map((sub, i) => (
            <tr key={sub.submissionId || i} className="border-b-[2px] border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-xs font-black text-gray-400">{i + 1}</td>
              <td className="py-3 px-4">
                <span className="font-black text-sm uppercase tracking-tight">
                  {sub.problem?.index} — {sub.problem?.name || "Unknown"}
                </span>
              </td>
              <td className="py-3 px-4 font-black text-sm">
                {sub.problem?.rating || "—"}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {(sub.problem?.tags || []).slice(0, 2).map(t => (
                    <span key={t} className="text-xs border-[2px] border-black px-2 py-0.5 font-bold uppercase tracking-wide">{t}</span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-600">
                {sub.programmingLanguage?.split(" ")[0] || "—"}
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 ${verdictStyle(sub.verdict)}`}>
                  {verdictLabel(sub.verdict)}
                </span>
              </td>
              <td className="py-3 px-4 text-xs font-bold text-gray-500 font-mono">
                {sub.creationTimeSeconds
                  ? new Date(sub.creationTimeSeconds * 1000).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Not Connected State ───────────────────────────────────────────────────────

function NotConnectedPage({ onOpenModal }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-3xl w-full text-center">
        <div className="text-8xl sm:text-[12rem] font-black tracking-tighter leading-none text-gray-100 select-none mb-8">CF</div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
          Codeforces<br />Not Connected
        </h1>
        <p className="text-base sm:text-lg font-bold uppercase tracking-widest text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
          Link your Codeforces account to unlock rating history, problem analytics, activity heatmap, and AI-backed growth insights.
        </p>
        <button
          onClick={onOpenModal}
          className="px-12 py-6 bg-black text-white text-xl font-black uppercase tracking-widest border-[4px] border-black hover:bg-gray-900 transition-colors shadow-[8px_8px_0_0_rgba(0,0,0,0.2)]"
        >
          Connect Codeforces →
        </button>

        {/* Feature preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20">
          {[
            { icon: "📈", label: "Rating History" },
            { icon: "🔥", label: "Activity Heatmap" },
            { icon: "🧩", label: "Problem Analytics" },
            { icon: "🏆", label: "Contest Stats" },
          ].map(({ icon, label }) => (
            <div key={label} className="border-[4px] border-black p-6 text-center">
              <div className="text-4xl mb-3">{icon}</div>
              <p className="font-black uppercase tracking-widest text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CodeforcesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    profile,
    ratingHistory,
    submissions,
    isConnected,
    isPending,
    loading,
    syncing,
    error,
    verificationCode,
    connectLoading,
    connectError,
    initiateConnect,
    verifyConnect,
    refresh,
    disconnect,
  } = useCodeforces();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main>
        <title>Codeforces - CodeLens</title>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-[6px] border-black border-t-transparent animate-spin" />
          <p className="font-black uppercase tracking-widest text-lg">Loading Codeforces Data...</p>
        </div>
      </div>
      </main>
    );
  }

  // ── Not connected ────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <>
      <main>
        <title>Codeforces - CodeLens</title>
        <NotConnectedPage onOpenModal={() => setModalOpen(true)} />
        <VerifyModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initiateConnect={initiateConnect}
          verifyConnect={verifyConnect}
          verificationCode={verificationCode}
          connectLoading={connectLoading}
          connectError={connectError}
        />
          </main>
      </>
    );
  }

  const stats = profile?.stats || {};
  const dailyActivity = stats.dailyActivity
    ? (stats.dailyActivity instanceof Map
        ? Object.fromEntries(stats.dailyActivity)
        : stats.dailyActivity)
    : {};
  const byTag = stats.byTag instanceof Map
    ? Object.fromEntries(stats.byTag)
    : (stats.byTag || {});

  // ── Connected — full data view ────────────────────────────────────────────
  return (
    <main>
      <title>Codeforces - CodeLens</title>
    <div className="min-h-screen bg-white text-black">

      {/* ── Profile Header ─────────────────────────────────────────────── */}
      <div className="w-full border-b-[4px] border-black bg-black text-white px-6 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-8">
          {profile?.avatar && (
            <img
            src={profile.avatar}
              alt={profile.handle}
              className="w-24 h-24 sm:w-32 sm:h-32 border-[4px] border-white object-cover flex-shrink-0"
              />
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
                {profile?.handle}
              </h1>
              <span className={`text-xl sm:text-2xl font-black uppercase tracking-widest ${rankColor(profile?.rank)} bg-white px-3 py-1`}>
                {profile?.rank || "Unrated"}
              </span>
            </div>
            <div className="flex flex-wrap gap-6 mt-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Rating</p>
                <p className="text-3xl font-black">{profile?.rating ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Max Rating</p>
                <p className="text-3xl font-black">{profile?.maxRating ?? "—"}</p>
              </div>
              {profile?.country && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Country</p>
                  <p className="text-lg font-black">{profile.country}</p>
                </div>
              )}
              {profile?.organization && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Organization</p>
                  <p className="text-lg font-black">{profile.organization}</p>
                </div>
              )}
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={refresh}
              disabled={syncing}
              className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-sm border-[3px] border-white hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "↻ Refresh"}
            </button>
            <button
              onClick={disconnect}
              className="px-6 py-3 border-[3px] border-gray-600 text-gray-400 font-black uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Last synced */}
        {profile?.lastSyncedAt && (
          <div className="max-w-7xl mx-auto mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Last synced: {new Date(profile.lastSyncedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ── Core Stats Grid ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-8">
          Core Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Problems Solved" value={stats.totalSolved} />
          <StatCard label="Total Submissions" value={stats.totalSubmissions} />
          <StatCard label="Accept Rate" value={stats.successRate != null ? `${stats.successRate}%` : null} />
          <StatCard label="Contests" value={stats.contestsParticipated} />
          <StatCard label="Current Streak" value={stats.currentStreak} sub="days" />
          <StatCard label="Longest Streak" value={stats.longestStreak} sub="days" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <StatCard label="Wrong Answers" value={stats.wrongAnswers} />
          <StatCard label="TLE" value={stats.timeLimitExceeded} />
          <StatCard label="RTE" value={stats.runtimeErrors} />
          <StatCard label="Best Rank" value={stats.bestRank} sub="in a contest" />
        </div>
      </section>

      {/* ── Activity Heatmap ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-8">
          Submission Activity
        </h2>
        <div className="border-[4px] border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <ActivityHeatmap dailyActivity={dailyActivity} />
        </div>
      </section>

      {/* ── Rating History Chart ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-8">
          Rating History
        </h2>
        <div className="border-[4px] border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <RatingChart history={ratingHistory} />
        </div>
      </section>

      {/* ── Tags + Difficulty ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tags */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-8">
              Problems by Tag
            </h2>
            <div className="border-[4px] border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <TagsChart byTag={byTag} />
            </div>
          </div>

          {/* Difficulty buckets */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-8">
              Problems by Difficulty
            </h2>
            <div className="border-[4px] border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              {Object.entries(stats.byRating || {})
                .filter(([, v]) => v > 0)
                .sort(([a], [b]) => {
                  if (a === "unrated") return 1;
                  if (b === "unrated") return -1;
                  return parseInt(a) - parseInt(b);
                })
                .map(([rating, count]) => {
                  const max = Math.max(...Object.values(stats.byRating || {}).map(Number));
                  return (
                    <div key={rating} className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-black w-20 text-right text-gray-600">{rating === "2500plus" ? "2500+" : rating}</span>
                      <div className="flex-1 bg-gray-100 border-[2px] border-black h-5">
                        <div className="bg-black h-full" style={{ width: `${(count / max) * 100}%` }} />
                      </div>
                      <span className="text-xs font-black w-6">{count}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Submissions ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-8">
          Recent Submissions
        </h2>
        <div className="border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <SubmissionsTable submissions={submissions} />
        </div>
      </section>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-black text-white border-[4px] border-white px-6 py-4 shadow-[8px_8px_0_0_rgba(255,255,255,0.3)]">
          <p className="font-black uppercase tracking-widest text-sm">{error}</p>
        </div>
      )}
    </div>
          </main>
  );
}
