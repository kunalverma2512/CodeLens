import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell,
  PieChart, Pie, Legend,
} from "recharts";

export const COLORS = ["#000","#222","#444","#666","#888","#aaa","#ccc"];
export const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n ?? 0);
export const timeAgo = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return `${Math.floor(s)}s ago`;
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

const TT = ({ contentStyle = {}, ...props }) => (
  <Tooltip
    contentStyle={{ border: "3px solid #000", borderRadius: 0, fontWeight: 900, fontSize: 11, textTransform: "uppercase", ...contentStyle }}
    cursor={{ fill: "rgba(0,0,0,0.06)" }}
    {...props}
  />
);

// ── Primitive components ──────────────────────────────────────────────────────

export function SectionLabel({ text }) {
  return <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500 mb-1">{text}</p>;
}

export function SectionTitle({ children }) {
  return <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-6 leading-none">{children}</h2>;
}

export function Card({ children, className = "", dark = false }) {
  const base = dark
    ? "border-[4px] border-black bg-black text-white"
    : "border-[4px] border-black bg-white";
  return <div className={`${base} p-6 sm:p-8 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, sub, dark = false }) {
  return (
    <div className={`border-[4px] border-black p-6 hover:-translate-y-1 transition-transform ${dark ? "bg-black text-white" : "bg-white"}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.22em] mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className="text-4xl sm:text-5xl font-black leading-none">{value}</p>
      {sub && <p className={`text-xs font-black uppercase tracking-widest mt-2 ${dark ? "text-gray-400" : "text-gray-400"}`}>{sub}</p>}
    </div>
  );
}

// ── Score Meter ───────────────────────────────────────────────────────────────
export function ScoreMeter({ label, score, desc }) {
  const pct = Math.min(100, Math.max(0, score ?? 0));
  const grade = pct >= 80 ? "Elite" : pct >= 60 ? "Strong" : pct >= 40 ? "Growing" : "Emerging";
  return (
    <div className="border-[4px] border-black p-5 bg-white hover:-translate-y-1 transition-transform">
      <div className="flex items-end justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{grade}</p>
      </div>
      <p className="text-4xl font-black leading-none mb-3">{pct}<span className="text-xl text-gray-400">/100</span></p>
      <div className="h-3 w-full border-[2px] border-black bg-gray-100">
        <div className="h-full bg-black transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      {desc && <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">{desc}</p>}
    </div>
  );
}

// ── Language Bytes Chart ──────────────────────────────────────────────────────
export function LangBytesChart({ langByBytes }) {
  if (!langByBytes?.length) return null;
  const total = langByBytes.reduce((s, l) => s + l.bytes, 0);
  return (
    <Card>
      <SectionLabel text="Code Composition" />
      <SectionTitle>Languages by Bytes Written</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={langByBytes} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontWeight: 900, fontSize: 10, fill: "#000" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontWeight: 900, fontSize: 9, fill: "#666" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
          <TT formatter={(v) => [`${(v/1024).toFixed(1)} KB`, "Bytes"]} />
          <Bar dataKey="bytes" radius={0}>
            {langByBytes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-4">
        {langByBytes.map((l, i) => {
          const pct = ((l.bytes / total) * 100).toFixed(1);
          return (
            <div key={l.name} className="flex items-center gap-2 border-[2px] border-black px-3 py-1">
              <div className="w-2 h-2" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-[10px] font-black uppercase tracking-widest">{l.name} {pct}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Activity by Month chart ───────────────────────────────────────────────────
export function ActivityChart({ activityByMonth }) {
  if (!activityByMonth?.length) return null;
  return (
    <Card>
      <SectionLabel text="Temporal Pattern" />
      <SectionTitle>Monthly Contribution Pulse</SectionTitle>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={activityByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="month" tick={{ fontWeight: 900, fontSize: 10, fill: "#000" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontWeight: 900, fontSize: 9, fill: "#666" }} axisLine={false} tickLine={false} />
          <TT />
          <Bar dataKey="count" fill="#000" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
export function ContribHeatmap({ contributions }) {
  if (!contributions) return null;
  const weeks = contributions.contributionCalendar?.weeks || [];
  const total = contributions.contributionCalendar?.totalContributions || 0;
  const maxC  = weeks.flatMap(w => w.contributionDays).reduce((m, d) => Math.max(m, d.contributionCount), 1);
  const op = (c) => c === 0 ? 0.05 : Math.max(0.15, c / maxC);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div><SectionLabel text="52-Week Activity" /><SectionTitle>Contribution Graph</SectionTitle></div>
        <div className="text-right">
          <p className="text-4xl font-black">{fmt(total)}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Contributions</p>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px] min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.contributionDays.map((day, di) => (
                <div key={di} title={`${day.date}: ${day.contributionCount}`}
                  className="w-3 h-3 border border-black cursor-default"
                  style={{ background: `rgba(0,0,0,${op(day.contributionCount)})` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Commits",      v: contributions.totalCommitContributions },
          { label: "PRs Opened",   v: contributions.totalPullRequestContributions },
          { label: "Issues",       v: contributions.totalIssueContributions },
          { label: "Repos Created",v: contributions.totalRepositoryContributions },
          { label: "PR Reviews",   v: contributions.totalPullRequestReviewContributions },
        ].map(({ label, v }) => (
          <div key={label} className="border-[2px] border-black p-3 text-center">
            <p className="text-2xl font-black">{fmt(v)}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Top Repos Table ───────────────────────────────────────────────────────────
export function TopReposTable({ repos }) {
  if (!repos?.length) return null;
  const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10);
  return (
    <Card>
      <SectionLabel text="Project Portfolio" />
      <SectionTitle>Top Repositories by Stars</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-[4px] border-black">
              {["Repository","Language","⭐","🍴","Issues","Updated"].map(h => (
                <th key={h} className="pb-3 pr-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((r, i) => (
              <tr key={r.id} className={`border-b-[2px] border-gray-100 hover:bg-black hover:text-white group transition-colors cursor-pointer ${i%2===1?"bg-gray-50":""}`}>
                <td className="py-3 pr-4">
                  <a href={r.html_url} target="_blank" rel="noopener noreferrer"
                    className="font-black uppercase text-xs tracking-wide underline underline-offset-4 group-hover:text-white block">{r.name}</a>
                  {r.description && <span className="text-[10px] text-gray-400 group-hover:text-gray-300 block max-w-xs truncate">{r.description}</span>}
                </td>
                <td className="py-3 pr-4 font-black text-xs uppercase">{r.language || "—"}</td>
                <td className="py-3 pr-4 font-black">{r.stargazers_count}</td>
                <td className="py-3 pr-4 font-black">{r.forks_count}</td>
                <td className="py-3 pr-4 font-black">{r.open_issues_count}</td>
                <td className="py-3 pr-4 text-[10px] font-black uppercase text-gray-400 group-hover:text-gray-300 whitespace-nowrap">
                  {new Date(r.pushed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
const EV = {
  PushEvent:"Pushed code", PullRequestEvent:"Pull Request", IssuesEvent:"Issue",
  CreateEvent:"Created branch/tag", WatchEvent:"Starred repo", ForkEvent:"Forked repo",
  DeleteEvent:"Deleted branch", IssueCommentEvent:"Issue Comment",
  PullRequestReviewEvent:"Reviewed PR", ReleaseEvent:"Released version",
};

export function ActivityFeed({ events }) {
  if (!events?.length) return null;
  const items = events.filter(e => EV[e.type]).slice(0, 20);
  return (
    <Card>
      <SectionLabel text="Real-time Feed" />
      <SectionTitle>Recent Activity</SectionTitle>
      <div className="divide-y-[2px] divide-gray-100">
        {items.map((e, i) => (
          <div key={i} className="flex items-center justify-between py-4 group hover:bg-black hover:px-3 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-black flex-shrink-0 group-hover:bg-white" />
              <div>
                <p className="text-sm font-black uppercase tracking-wide group-hover:text-white">{EV[e.type]}</p>
                <p className="text-xs font-bold text-gray-500 group-hover:text-gray-300">{e.repo?.name?.split("/")[1]}</p>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-300 ml-4 flex-shrink-0">
              {timeAgo(e.created_at)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Gists Panel ───────────────────────────────────────────────────────────────
export function GistsPanel({ gists }) {
  if (!gists?.length) return null;
  return (
    <Card>
      <SectionLabel text="Public Knowledge Base" />
      <SectionTitle>Gists & Snippets</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gists.slice(0, 8).map((g) => {
          const filename = Object.keys(g.files || {})[0];
          const file     = g.files[filename];
          return (
            <a key={g.id} href={g.html_url} target="_blank" rel="noopener noreferrer"
              className="border-[3px] border-black p-4 hover:bg-black hover:text-white group transition-colors block">
              <p className="text-xs font-black uppercase tracking-widest truncate group-hover:text-white">{filename}</p>
              {g.description && <p className="text-[10px] text-gray-500 group-hover:text-gray-300 mt-1 truncate">{g.description}</p>}
              <div className="flex gap-4 mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-300">
                {file?.language && <span>{file.language}</span>}
                <span>⭐ {g.forks?.length || 0}</span>
                <span>{new Date(g.created_at).toLocaleDateString()}</span>
              </div>
            </a>
          );
        })}
      </div>
    </Card>
  );
}

// ── Starred repos topics ──────────────────────────────────────────────────────
export function StarredInsights({ starredTopics, starredLangs, starred }) {
  if (!starred?.length) return null;
  return (
    <Card>
      <SectionLabel text="Learning & Inspiration" />
      <SectionTitle>Starred Repos Intelligence</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Favorite Languages in Starred</p>
          <div className="space-y-2">
            {starredLangs?.slice(0, 6).map((l, i) => {
              const max = starredLangs[0]?.count || 1;
              return (
                <div key={l.name} className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest w-24 flex-shrink-0">{l.name}</span>
                  <div className="flex-1 h-3 border-[2px] border-black bg-gray-100">
                    <div className="h-full bg-black" style={{ width: `${(l.count/max)*100}%` }} />
                  </div>
                  <span className="text-[10px] font-black w-4">{l.count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Top Topics in Starred</p>
          <div className="flex flex-wrap gap-2">
            {starredTopics?.slice(0, 16).map(({ topic, count }) => (
              <span key={topic} className="px-3 py-1 border-[2px] border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                {topic} <span className="text-gray-400 ml-1">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Recently Starred</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {starred.slice(0, 6).map((r) => (
            <a key={r.id} href={r.html_url} target="_blank" rel="noopener noreferrer"
              className="flex items-start justify-between border-[2px] border-black p-3 hover:bg-black hover:text-white group transition-colors">
              <div>
                <p className="text-xs font-black uppercase tracking-wide group-hover:text-white">{r.full_name}</p>
                {r.description && <p className="text-[10px] text-gray-500 group-hover:text-gray-300 mt-1 max-w-xs truncate">{r.description}</p>}
              </div>
              <span className="text-[10px] font-black ml-2 flex-shrink-0">⭐{fmt(r.stargazers_count)}</span>
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Orgs ─────────────────────────────────────────────────────────────────────
export function OrgsPanel({ orgs }) {
  if (!orgs?.length) return null;
  return (
    <Card dark>
      <SectionLabel text="Affiliations" />
      <SectionTitle>Organizations</SectionTitle>
      <div className="flex flex-wrap gap-4">
        {orgs.map((org) => (
          <a key={org.id} href={`https://github.com/${org.login}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 border-[2px] border-white px-4 py-3 hover:bg-white hover:text-black transition-colors group">
            <img src={org.avatar_url} alt={org.login} className="w-8 h-8 border-[2px] border-white group-hover:border-black" />
            <span className="text-xs font-black uppercase tracking-widest">{org.login}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}

// ── PR/Issues footprint ───────────────────────────────────────────────────────
export function PRFootprint({ prs, issues, mergeRatio }) {
  return (
    <Card>
      <SectionLabel text="Open Source Footprint" />
      <SectionTitle>Pull Requests & Issues</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="border-[3px] border-black p-4 text-center">
          <p className="text-3xl font-black">{fmt(prs?.total_count)}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Merged PRs</p>
        </div>
        <div className="border-[3px] border-black p-4 text-center">
          <p className="text-3xl font-black">{mergeRatio !== null ? `${mergeRatio}%` : "—"}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Merge Rate</p>
        </div>
        <div className="border-[3px] border-black p-4 text-center">
          <p className="text-3xl font-black">{fmt(issues?.total_count)}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Issues Opened</p>
        </div>
        <div className="border-[3px] border-black p-4 bg-black text-white text-center">
          <p className="text-3xl font-black">{fmt((prs?.total_count||0) + (issues?.total_count||0))}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Total Contributions</p>
        </div>
      </div>
      {prs?.items?.length > 0 && (
        <>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Recent Merged Pull Requests</p>
          <div className="divide-y-[2px] divide-gray-100">
            {prs.items.slice(0, 8).map((pr) => (
              <a key={pr.id} href={pr.html_url} target="_blank" rel="noopener noreferrer"
                className="flex items-start justify-between py-3 hover:bg-black hover:px-3 hover:text-white group transition-all">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide group-hover:text-white line-clamp-1">{pr.title}</p>
                  <p className="text-[10px] text-gray-500 group-hover:text-gray-300">{pr.repository_url?.split("/repos/")[1]}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-300 ml-4 flex-shrink-0">
                  {timeAgo(pr.created_at)}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
