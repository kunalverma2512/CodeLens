import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGitHubDashboard } from "../services/githubService";
import {
  StatCard, ScoreMeter, LangBytesChart, ActivityChart,
  ContribHeatmap, TopReposTable, ActivityFeed,
  GistsPanel, StarredInsights, OrgsPanel, PRFootprint, fmt,
} from "../components/github/GitHubComponents";

// ── Loading ───────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="w-full flex-1 bg-white px-4 sm:px-6 md:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-48 border-[4px] border-black animate-pulse bg-gray-100" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 border-[4px] border-black animate-pulse bg-gray-100" />)}
        </div>
        {[...Array(4)].map((_, i) => <div key={i} className="h-64 border-[4px] border-black animate-pulse bg-gray-100" />)}
      </div>
    </div>
  );
}

// ── Not connected ─────────────────────────────────────────────────────────────
function NotConnected() {
  return (
    <div className="w-full flex-1 bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full border-[4px] border-black p-10 text-center shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
        <div className="text-7xl font-black text-gray-100 mb-6 select-none">GH</div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">GitHub Not Connected</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8 leading-relaxed">
          Connect your GitHub account from Account Center to unlock full repository analytics, contribution data, language insights, and activity feed.
        </p>
        <Link to="/account-center"
          className="inline-block px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-sm border-[4px] border-black hover:bg-white hover:text-black transition-colors">
          Connect GitHub →
        </Link>
      </div>
    </div>
  );
}

// ── Profile Hero ──────────────────────────────────────────────────────────────
function ProfileHero({ profile, orgs, totalStars, totalForks, ownedRepos, forkedRepos }) {
  return (
    <div className="border-[4px] border-black bg-black text-white shadow-[12px_12px_0_0_rgba(0,0,0,0.25)]">
      <div className="p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:items-start">
        {/* Avatar */}
        {profile?.avatar_url && (
          <img src={profile.avatar_url} alt={profile.login}
            className="w-24 h-24 sm:w-28 sm:h-28 border-[4px] border-white object-cover flex-shrink-0" />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400 mb-1">GitHub Profile</p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            {profile?.name || profile?.login}
          </h1>
          <a href={`https://github.com/${profile?.login}`} target="_blank" rel="noopener noreferrer"
            className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white underline underline-offset-4">
            @{profile?.login}
          </a>
          {profile?.bio && (
            <p className="mt-3 text-sm font-bold text-gray-300 max-w-2xl leading-relaxed">{profile.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-black uppercase tracking-widest text-gray-400">
            {profile?.company          && <span>🏢 {profile.company}</span>}
            {profile?.location         && <span>📍 {profile.location}</span>}
            {profile?.blog             && <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">🔗 Website</a>}
            {profile?.twitter_username && <span>🐦 @{profile.twitter_username}</span>}
            {profile?.email            && <span>✉ {profile.email}</span>}
            {profile?.hireable         && <span className="border border-white px-2 py-0.5">Open to Work</span>}
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-2 flex-shrink-0 sm:text-right">
          {[
            { label: "Followers",    val: fmt(profile?.followers) },
            { label: "Following",    val: fmt(profile?.following) },
            { label: "Public Repos", val: fmt(profile?.public_repos) },
            { label: "Public Gists", val: fmt(profile?.public_gists) },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-2xl sm:text-3xl font-black">{val}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t-[3px] border-white grid grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Stars Earned",    val: fmt(totalStars) },
          { label: "Total Forks",     val: fmt(totalForks) },
          { label: "Original Repos",  val: fmt(ownedRepos?.length) },
          { label: "Forked Repos",    val: fmt(forkedRepos?.length) },
        ].map(({ label, val }, i) => (
          <div key={label} className={`p-5 text-center ${i < 3 ? "border-r-[2px] border-white" : ""}`}>
            <p className="text-3xl font-black">{val}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scores Section ────────────────────────────────────────────────────────────
function ScoresSection({ metrics }) {
  const scores = [
    { label: "Consistency", score: metrics.consistencyScore, desc: `${metrics.activeDays} active days of 365` },
    { label: "Collaboration", score: metrics.collabScore, desc: `${fmt(metrics.totalPRs)} PRs + ${fmt(metrics.totalReviews)} reviews` },
    { label: "Open Source Impact", score: metrics.osScore, desc: "Repos receiving community stars" },
    { label: "Language Diversity", score: metrics.diversityScore, desc: `${Math.round(metrics.diversityScore/8)} languages detected` },
  ];
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500 mb-2">Developer Intelligence</p>
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">CodeLens Performance Scores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s) => <ScoreMeter key={s.label} {...s} />)}
      </div>
      {/* Streak + merge ratio callouts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        <div className="border-[4px] border-black bg-black text-white p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Best Streak</p>
          <p className="text-4xl font-black">{metrics.longestStreak}<span className="text-xl text-gray-400 ml-1">days</span></p>
        </div>
        <div className="border-[4px] border-black p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Total Commits</p>
          <p className="text-4xl font-black">{fmt(metrics.totalCommits)}</p>
        </div>
        {metrics.mergeRatio !== null && (
          <div className="border-[4px] border-black p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">PR Merge Rate</p>
            <p className="text-4xl font-black">{metrics.mergeRatio}<span className="text-xl text-gray-400">%</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function GitHubIntelligencePage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    getGitHubDashboard()
      .then(res => setData(res.data.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (error?.toLowerCase().includes("not connected")) return <NotConnected />;
  if (error) return (
    <div className="w-full flex-1 flex items-center justify-center p-10">
      <div className="border-[4px] border-black p-8 max-w-md text-center">
        <p className="font-black uppercase tracking-widest text-sm mb-3">Failed to load GitHub data</p>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 border-[3px] border-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
          Retry
        </button>
      </div>
    </div>
  );
  if (!data) return <NotConnected />;

  const {
    profile, orgs, repos, ownedRepos, forkedRepos, topByStars,
    totalStars, totalForks, langByBytes, contributions, events,
    gists, starred, starredTopics, starredLangs,
    prs, issues, metrics,
  } = data;

  return (
    <div className="w-full flex-1 bg-white px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero */}
        <ProfileHero profile={profile} orgs={orgs}
          totalStars={totalStars} totalForks={totalForks}
          ownedRepos={ownedRepos} forkedRepos={forkedRepos} />

        {/* Scores */}
        {metrics && <ScoresSection metrics={metrics} />}

        {/* Heatmap */}
        <ContribHeatmap contributions={contributions} />

        {/* Language + Activity chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LangBytesChart langByBytes={langByBytes} />
          <ActivityChart activityByMonth={metrics?.activityByMonth} />
        </div>

        {/* PR Footprint */}
        <PRFootprint prs={prs} issues={issues} mergeRatio={metrics?.mergeRatio} />

        {/* Top Repos */}
        <TopReposTable repos={topByStars} />

        {/* Activity + Gists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed events={events} />
          <GistsPanel gists={gists} />
        </div>

        {/* Starred intelligence */}
        <StarredInsights starred={starred} starredTopics={starredTopics} starredLangs={starredLangs} />

        {/* Orgs */}
        {orgs?.length > 0 && <OrgsPanel orgs={orgs} />}

        {/* Account metadata footer */}
        {profile && (
          <div className="border-t-[4px] border-black pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Member Since",  val: new Date(profile.created_at).getFullYear() },
              { label: "Last Updated",  val: new Date(profile.updated_at).toLocaleDateString() },
              { label: "Account Type",  val: profile.type },
              { label: "Site Admin",    val: profile.site_admin ? "Yes" : "No" },
              { label: "Hireable",      val: profile.hireable ? "Yes" : "Not Listed" },
              { label: "GitHub ID",     val: `#${profile.id}` },
            ].map(({ label, val }) => (
              <div key={label} className="border-[2px] border-black p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-black uppercase">{String(val)}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
