import CodeforcesProfile from "../models/CodeforcesProfile.js";
import CodeforcesSubmission from "../models/CodeforcesSubmission.js";
import CodeforcesRatingHistory from "../models/CodeforcesRatingHistory.js";
import GithubData from "../models/GithubData.js";
import User from "../models/User.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const NOW_SECONDS = () => Math.floor(Date.now() / 1000);
const SECONDS_PER_DAY = 86400;

// Tags with fewer than this many solves are ignored in decay analysis (noise filter)
const MIN_TAG_SOLVES_FOR_DECAY = 3;

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Computes days elapsed from a Unix timestamp (seconds) to now.
 */
function daysSince(unixSeconds) {
  if (!unixSeconds) return null;
  return Math.floor((NOW_SECONDS() - unixSeconds) / SECONDS_PER_DAY);
}

/**
 * Computes days elapsed from a JS Date object to now.
 */
function daysSinceDate(date) {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * SECONDS_PER_DAY));
}

/**
 * Skill Decay Score for a single tag.
 *
 * Formula: totalSolved / (1 + daysSinceLastSolve)
 *
 * Interpretation:
 *   - High score (> 1.0) = practiced recently AND many solves → strong, fresh
 *   - Mid score (0.2–1.0) = either few solves or long gap → needs attention
 *   - Low score (< 0.2)   = very rusty or barely explored → likely forgotten
 *
 * This directly addresses the "Striver sheet problem": a user with 50 DP
 * problems solved but last touched 90 days ago gets a very low decay score,
 * even though their overall count looks impressive.
 */
function computeDecayScore(totalSolved, daysSinceLastSolve) {
  if (!daysSinceLastSolve && daysSinceLastSolve !== 0) return null;
  return parseFloat((totalSolved / (1 + daysSinceLastSolve)).toFixed(3));
}

/**
 * Classifies a coder as "binge", "steady", or "inactive" based on their
 * 30-day daily activity map from CodeforcesProfile.stats.dailyActivity.
 *
 * - binge:    Many submissions on a few days, long gaps in between
 * - steady:   Regular daily or near-daily activity
 * - inactive: Very few active days in 30 days
 */
function classifyConsistency(dailyActivity) {
  if (!dailyActivity || typeof dailyActivity !== "object") return "unknown";

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter to last 30 days
  const recentDays = Object.entries(dailyActivity)
    .filter(([dateStr]) => new Date(dateStr) >= thirtyDaysAgo)
    .map(([, count]) => Number(count));

  if (recentDays.length === 0) return "inactive";

  const activeDays = recentDays.filter((c) => c > 0).length;
  const totalSubmissions = recentDays.reduce((a, b) => a + b, 0);
  const avgPerActiveDay = activeDays > 0 ? totalSubmissions / activeDays : 0;

  if (activeDays < 5) return "inactive";
  if (activeDays >= 18) return "steady"; // active more than 60% of days
  // Binge = few active days but high submissions on those days
  if (avgPerActiveDay > 8 && activeDays < 12) return "binge";
  return "moderate";
}

/**
 * Computes rating trajectory from last 3 contests.
 * Returns: "improving", "declining", "stagnant", or "insufficient_data"
 */
function computeRatingTrajectory(recentContests) {
  if (!recentContests || recentContests.length < 2) return "insufficient_data";

  const last3 = recentContests.slice(0, 3);
  const changes = last3.map((c) => (c.newRating ?? 0) - (c.oldRating ?? 0));
  const netChange = changes.reduce((a, b) => a + b, 0);

  if (netChange > 50) return "improving";
  if (netChange < -50) return "declining";
  return "stagnant";
}

// ─── Main exported function ───────────────────────────────────────────────────

/**
 * compileUserContext(userId)
 *
 * Reads all available data from MongoDB for this user and returns:
 *   {
 *     raw:         { ...structured JS object for internal use / storage },
 *     promptBlock: "...formatted string for injection into Gemini system prompt"
 *   }
 *
 * This is a PURE READ function — it never writes to the DB.
 * Safe to call multiple times; always returns the freshest data.
 */
export async function compileUserContext(userId) {
  // ── 1. Parallel fetch of all data sources ──────────────────────────────────
  const [user, cfProfile, recentContests, githubDoc] = await Promise.all([
    User.findById(userId).select("name email handles goals activity").lean(),
    CodeforcesProfile.findOne({ user: userId, isVerified: true }).lean(),
    CodeforcesRatingHistory.find({ user: userId })
      .sort({ ratingUpdateTimeSeconds: -1 })
      .limit(5)
      .lean(),
    GithubData.findOne({ userId }).lean(),
  ]);

  if (!user) throw new Error(`User not found: ${userId}`);

  // ── 2. Codeforces analysis ─────────────────────────────────────────────────
  let cfContext = null;

  if (cfProfile) {
    // --- Skill decay per tag ---
    // We need the last time each tag was solved → query submissions
    // Group accepted submissions by tag and find the most recent `creationTimeSeconds`
    const tagDecayData = {};

    if (cfProfile.stats?.byTag) {
      const tagMap =
        cfProfile.stats.byTag instanceof Map
          ? Object.fromEntries(cfProfile.stats.byTag)
          : cfProfile.stats.byTag;

      // Get all accepted submissions with tags, sorted newest first
      const acceptedSubs = await CodeforcesSubmission.find(
        { user: userId, verdict: "OK" },
        { "problem.tags": 1, creationTimeSeconds: 1, _id: 0 }
      )
        .sort({ creationTimeSeconds: -1 })
        .lean();

      // For each tag, find the most recent solve
      const lastSolvedByTag = {};
      for (const sub of acceptedSubs) {
        const tags = sub.problem?.tags ?? [];
        for (const tag of tags) {
          if (!(tag in lastSolvedByTag)) {
            lastSolvedByTag[tag] = sub.creationTimeSeconds;
          }
        }
      }

      // Compute decay score for tags with enough solves
      for (const [tag, totalSolved] of Object.entries(tagMap)) {
        if (totalSolved < MIN_TAG_SOLVES_FOR_DECAY) continue;
        const lastSolvedSeconds = lastSolvedByTag[tag] ?? null;
        const daysSinceLast = lastSolvedSeconds ? daysSince(lastSolvedSeconds) : 999;
        const decayScore = computeDecayScore(totalSolved, daysSinceLast);

        tagDecayData[tag] = {
          totalSolved,
          daysSinceLastSolve: daysSinceLast,
          decayScore,
          status:
            decayScore > 1.0 ? "fresh" :
            decayScore > 0.2 ? "rusty" :
            "forgotten",
        };
      }
    }

    // --- Sort tags by decay score ascending (rustiest first) ---
    const rustiest = Object.entries(tagDecayData)
      .sort((a, b) => a[1].decayScore - b[1].decayScore)
      .slice(0, 5)
      .map(([tag, d]) => ({ tag, ...d }));

    // --- Consistency classification ---
    const dailyActivityRaw =
      cfProfile.stats?.dailyActivity instanceof Map
        ? Object.fromEntries(cfProfile.stats.dailyActivity)
        : cfProfile.stats?.dailyActivity ?? {};

    const consistencyType = classifyConsistency(dailyActivityRaw);

    // --- Rating trajectory ---
    const trajectory = computeRatingTrajectory(recentContests);

    // --- Top performing tags (most solved, freshest) ---
    const strongTags = Object.entries(tagDecayData)
      .sort((a, b) => b[1].decayScore - a[1].decayScore)
      .slice(0, 5)
      .map(([tag, d]) => ({ tag, totalSolved: d.totalSolved, decayScore: d.decayScore }));

    cfContext = {
      handle: cfProfile.handle,
      currentRating: cfProfile.rating,
      rank: cfProfile.rank,
      peakRating: cfProfile.maxRating,
      peakRank: cfProfile.maxRank,
      totalSolved: cfProfile.stats?.totalSolved ?? 0,
      acceptanceRate: cfProfile.stats?.successRate ?? 0,
      contestsParticipated: cfProfile.stats?.contestsParticipated ?? 0,
      bestContestRank: cfProfile.stats?.bestRank ?? null,
      currentStreak: cfProfile.stats?.currentStreak ?? 0,
      longestStreak: cfProfile.stats?.longestStreak ?? 0,
      consistencyType,
      ratingTrajectory: trajectory,
      lastContests: recentContests.slice(0, 3).map((c) => ({
        name: c.contestName,
        rank: c.rank,
        oldRating: c.oldRating,
        newRating: c.newRating,
        change: (c.newRating ?? 0) - (c.oldRating ?? 0),
      })),
      rustiest5Tags: rustiest,
      strongest5Tags: strongTags,
      lastSyncedAt: cfProfile.lastSyncedAt,
    };
  }

  // ── 3. GitHub analysis ─────────────────────────────────────────────────────
  let githubContext = null;

  if (githubDoc?.data) {
    const gh = githubDoc.data;

    // Real field names from GitHubService.#computeMetrics and #fetchDashboardData:
    //   gh.metrics.totalCommits   — total commit contributions in last year
    //   gh.metrics.activeDays     — active days in last 52 weeks
    //   gh.metrics.longestStreak  — longest consecutive active days
    //   gh.metrics.langBreakdown  — [{ name, count }] sorted by frequency
    //   gh.metrics.consistencyScore — 0-100
    //   gh.ownedRepos             — array of non-forked repos
    //   gh.recentlyPushed         — [{ name, pushed_at, language, ... }]
    //   gh.totalStars             — total stars across all repos
    //   gh.profile                — GitHub user object (login, public_repos, etc.)
    //   gh.langByBytes            — [{ name, bytes }] top languages by code volume
    //   gh.contributions.contributionCalendar.totalContributions

    const metrics        = gh.metrics ?? {};
    const totalCommits   = metrics.totalCommits ?? 0;
    const activeDays     = metrics.activeDays ?? null;
    const longestStreak  = metrics.longestStreak ?? null;
    const totalRepos     = gh.ownedRepos?.length ?? gh.profile?.public_repos ?? null;
    const totalStars     = gh.totalStars ?? 0;
    const totalPRs       = metrics.totalPRs ?? null;
    const consistencyScore = metrics.consistencyScore ?? null;

    // Top languages by code volume (bytes)
    const topLanguages = (gh.langByBytes ?? [])
      .slice(0, 5)
      .map((l) => l.name);

    // Last pushed repo date → days since last commit
    const lastPushedDate = gh.recentlyPushed?.[0]?.pushed_at ?? null;
    const daysSinceCommit = lastPushedDate ? daysSinceDate(lastPushedDate) : null;

    // Activity health based on days since last push
    let githubHealth = "unknown";
    if (daysSinceCommit !== null) {
      if (daysSinceCommit <= 3)  githubHealth = "very_active";
      else if (daysSinceCommit <= 10) githubHealth = "active";
      else if (daysSinceCommit <= 30) githubHealth = "moderate";
      else githubHealth = "inactive";
    }

    // Recent repos for context
    const recentRepos = (gh.recentlyPushed ?? []).slice(0, 3).map((r) => ({
      name: r.name,
      language: r.language,
      pushedAt: r.pushed_at,
    }));

    githubContext = {
      username:          gh.profile?.login ?? null,
      totalCommits,
      totalRepos,
      totalStars,
      totalPRs,
      activeDaysInYear:  activeDays,
      longestStreak,
      consistencyScore,
      topLanguages,
      daysSinceLastPush: daysSinceCommit,
      activityHealth:    githubHealth,
      recentRepos,
      lastSyncedAt:      githubDoc.lastSyncedAt,
    };
  }

  // ── 4. User goals ──────────────────────────────────────────────────────────
  const activeGoals = (user.goals ?? []).map((g) => ({
    title: g.title,
    type: g.type,
    progress: g.progress,
    target: g.target,
    deadline: g.deadline ? new Date(g.deadline).toDateString() : null,
  }));

  // ── 5. Assemble raw context object ─────────────────────────────────────────
  const raw = {
    compiledAt: new Date().toISOString(),
    user: {
      name: user.name,
      email: user.email,
    },
    codeforces: cfContext,
    github: githubContext,
    goals: activeGoals,
  };

  // ── 6. Format prompt block ─────────────────────────────────────────────────
  const promptBlock = buildPromptBlock(raw);

  return { raw, promptBlock };
}

// ─── Prompt block formatter ───────────────────────────────────────────────────

/**
 * Converts the raw context object into a clean, token-efficient string
 * that gets injected into the Gemini system prompt.
 * Intentionally terse — every token counts against the quota.
 */
function buildPromptBlock(ctx) {
  const lines = [];

  lines.push(`=== USER INTELLIGENCE REPORT (compiled: ${ctx.compiledAt}) ===`);
  lines.push(`Developer: ${ctx.user.name}`);
  lines.push("");

  // — Codeforces block —
  if (ctx.codeforces) {
    const cf = ctx.codeforces;
    lines.push("--- CODEFORCES ---");
    lines.push(`Handle: ${cf.handle} | Rating: ${cf.currentRating} (${cf.rank}) | Peak: ${cf.peakRating} (${cf.peakRank})`);
    lines.push(`Solved: ${cf.totalSolved} | Acceptance: ${cf.acceptanceRate}% | Contests: ${cf.contestsParticipated} | Best Rank: ${cf.bestContestRank ?? "N/A"}`);
    lines.push(`Streak: ${cf.currentStreak} days current / ${cf.longestStreak} days longest`);
    lines.push(`Consistency Pattern: ${cf.consistencyType.toUpperCase()} | Rating Trajectory: ${cf.ratingTrajectory.toUpperCase()}`);

    if (cf.lastContests.length > 0) {
      const contestStr = cf.lastContests
        .map((c) => `[${c.name?.slice(0, 30)}] rank#${c.rank} ${c.change >= 0 ? "+" : ""}${c.change}`)
        .join(" | ");
      lines.push(`Last ${cf.lastContests.length} Contests: ${contestStr}`);
    }

    if (cf.rustiest5Tags.length > 0) {
      lines.push("");
      lines.push("SKILL DECAY ANALYSIS (rustiest topics — where consistency has broken down):");
      for (const t of cf.rustiest5Tags) {
        lines.push(
          `  [${t.status.toUpperCase()}] ${t.tag}: ${t.totalSolved} solved, last ${t.daysSinceLastSolve}d ago, decay score ${t.decayScore}`
        );
      }
    }

    if (cf.strongest5Tags.length > 0) {
      lines.push("");
      lines.push("STRONGEST TOPICS (actively practiced, high solves):");
      lines.push(
        cf.strongest5Tags.map((t) => `${t.tag}(${t.totalSolved})`).join(", ")
      );
    }

    lines.push("");
  } else {
    lines.push("--- CODEFORCES: Not connected ---");
    lines.push("");
  }

  // — GitHub block —
  if (ctx.github) {
    const gh = ctx.github;
    lines.push("--- GITHUB ---");
    lines.push(`Username: ${gh.username ?? "N/A"} | Activity Health: ${gh.activityHealth.toUpperCase()} | Consistency Score: ${gh.consistencyScore ?? "N/A"}/100`);
    lines.push(`Last repo push: ${gh.daysSinceLastPush !== null ? `${gh.daysSinceLastPush} days ago` : "unknown"} | Commits (last year): ${gh.totalCommits} | Owned repos: ${gh.totalRepos ?? "N/A"} | Total stars: ${gh.totalStars}`);
    lines.push(`Longest active streak: ${gh.longestStreak ?? "N/A"} days | Active days in last year: ${gh.activeDaysInYear ?? "N/A"}`);
    if (gh.totalPRs !== null) lines.push(`Pull requests: ${gh.totalPRs}`);
    if (gh.topLanguages?.length) {
      lines.push(`Top languages: ${gh.topLanguages.join(", ")}`);
    }
    if (gh.recentRepos?.length) {
      const repoStr = gh.recentRepos.map((r) => `${r.name}${r.language ? ` (${r.language})` : ""}`).join(", ");
      lines.push(`Recently active repos: ${repoStr}`);
    }
    lines.push("");
  } else {
    lines.push("--- GITHUB: Not connected or not synced yet ---");
    lines.push("");
  }


  // — Goals block —
  if (ctx.goals.length > 0) {
    lines.push("--- ACTIVE GOALS ---");
    for (const g of ctx.goals) {
      lines.push(`  [${g.type?.toUpperCase()}] ${g.title}: ${g.progress}/${g.target ?? "?"} ${g.deadline ? `(deadline: ${g.deadline})` : ""}`);
    }
    lines.push("");
  }

  lines.push("=== END REPORT ===");

  return lines.join("\n");
}
