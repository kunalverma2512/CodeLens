import { useState, useEffect } from "react";
import { Star, GitFork, Bug } from "lucide-react";

function AvailabilityCard() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
        Availability
      </p>
      <div className="flex items-start gap-3">
        <span className="relative flex h-3 w-3 mt-0.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Open for feedback and project discussions.
        </p>
      </div>
    </div>
  );
}

function TimezoneCard() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
        Timezone
      </p>
      <p className="text-sm font-medium text-neutral-900">IST</p>
      <p className="font-mono text-xs text-neutral-400 mt-0.5">UTC +5:30</p>
    </div>
  );
}

const STATS_CACHE = new Map();
const CACHE_TTL = 300_000;

function GitHubStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      const repo = "kunalverma2512/CodeLens";

      const cached = STATS_CACHE.get(repo);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (!cancelled) {
          setStats(cached.stats);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo}`,
        );

        const rateLimitRemaining = res.headers.get("X-RateLimit-Remaining");

        if (!res.ok) {
          if (rateLimitRemaining === "0") {
            throw new Error("Rate limit exceeded. Please try again later.");
          }
          throw new Error(`GitHub API responded with ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled) {
          const statsData = {
            stars: data.stargazers_count,
            forks: data.forks_count,
            openIssues: data.open_issues_count,
          };
          STATS_CACHE.set(repo, { stats: statsData, timestamp: Date.now() });
          setStats(statsData);
          setError("");
        }
      } catch (err) {
        console.error("[GitHubStats]", err.message);
        if (!cancelled) {
          setError(err.message || "Unable to load stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
          GitHub
        </p>
        <p className="text-xs text-neutral-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
        GitHub
      </p>
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-neutral-400" />
            <span className="font-mono text-sm text-neutral-700">
              {stats.stars.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400">stars</span>
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="h-3.5 w-3.5 text-neutral-400" />
            <span className="font-mono text-sm text-neutral-700">
              {stats.forks.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400">forks</span>
          </div>
          <div className="flex items-center gap-2">
            <Bug className="h-3.5 w-3.5 text-neutral-400" />
            <span className="font-mono text-sm text-neutral-700">
              {stats.openIssues.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400">open issues</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BuilderCard() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
        Built by
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600 shrink-0">
          KV
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900">Kunal Verma</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            Built by developers, for developers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContactSidebar() {
  return (
    <aside className="w-full lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-4">
        <AvailabilityCard />
        <TimezoneCard />
        <GitHubStats />
        <BuilderCard />
      </div>
    </aside>
  );
}
