import axios from "axios";
import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";

const GH_API = "https://api.github.com";

const ghHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "CodeLens-App",
  "X-GitHub-Api-Version": "2022-11-28",
});

async function ghFetch(url, token, params = {}) {
  try {
    const res = await axios.get(url, { headers: ghHeaders(token), params });
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    if (err.response?.status === 403) {
      if (err.response.headers && err.response.headers['x-ratelimit-remaining'] === '0') {
        throw new ApiError(403, "GitHub rate limit exceeded.");
      }
      return null; // Silent fail for missing scopes (like /user/orgs)
    }
    if (err.response?.status === 422) return null;
    if (err.response?.status === 401) throw new ApiError(401, "GitHub token invalid or expired. Please reconnect.");
    return null; // silent fail for non-critical endpoints
  }
}

async function ghSearch(query, token) {
  try {
    const res = await axios.get(`${GH_API}/search/issues`, {
      headers: ghHeaders(token),
      params: { q: query, per_page: 100 },
    });
    return res.data;
  } catch { return { total_count: 0, items: [] }; }
}

class GitHubService {
  static async #getToken(userId) {
    const user = await User.findById(userId)
      .select("oauth.github.accessToken oauth.github.username handles.github")
      .lean();
    const token = user?.oauth?.github?.accessToken;
    if (!token) throw new ApiError(400, "GitHub account not connected. Please connect from Account Center.");
    return { token, username: user?.oauth?.github?.username || user?.handles?.github };
  }

  /** ── GraphQL contribution calendar ─────────────────────────────────── */
  static async #fetchContributions(username, token) {
    const query = `query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoryContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount color } }
          }
          commitContributionsByRepository(maxRepositories: 25) {
            repository { nameWithOwner primaryLanguage { name } }
            contributions { totalCount }
          }
        }
      }
    }`;
    try {
      const res = await axios.post(
        "https://api.github.com/graphql",
        { query, variables: { login: username } },
        { headers: ghHeaders(token) }
      );
      return res.data?.data?.user?.contributionsCollection || null;
    } catch { return null; }
  }

  /** ── Compute derived analytics scores ───────────────────────────────── */
  static #computeMetrics({ repos, contributions, events, prs, issues }) {
    // --- Consistency score (0-100): based on active days in last 52 weeks
    const days = contributions?.contributionCalendar?.weeks?.flatMap(w => w.contributionDays) || [];
    const activeDays = days.filter(d => d.contributionCount > 0).length;
    const consistencyScore = Math.min(100, Math.round((activeDays / 365) * 100));

    // --- Streak (longest consecutive active days)
    let streak = 0, best = 0, cur = 0;
    for (const d of days) {
      cur = d.contributionCount > 0 ? cur + 1 : 0;
      if (cur > best) best = cur;
    }
    streak = best;

    // --- Collaboration score: PRs + reviews + issues opened relative to commits
    const totalCommits = contributions?.totalCommitContributions || 0;
    const totalPRs     = contributions?.totalPullRequestContributions || 0;
    const totalReviews = contributions?.totalPullRequestReviewContributions || 0;
    const totalIssues  = contributions?.totalIssueContributions || 0;
    const collabScore  = Math.min(100, Math.round(
      ((totalPRs * 3 + totalReviews * 2 + totalIssues) / Math.max(totalCommits + 1, 1)) * 100
    ));

    // --- Open source score: repos with stars + forks + topics
    const ownedRepos = repos?.filter(r => !r.fork) || [];
    const starredRepos = ownedRepos.filter(r => r.stargazers_count > 0).length;
    const osScore = Math.min(100, Math.round(
      (starredRepos / Math.max(ownedRepos.length, 1)) * 100
    ));

    // --- Language diversity
    const langs = {};
    repos?.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const langCount = Object.keys(langs).length;
    const diversityScore = Math.min(100, langCount * 8);

    // --- Merged PR ratio
    const mergedPRs  = prs?.items?.filter(p => p.pull_request?.merged_at)?.length || 0;
    const totalPRsSearch = prs?.total_count || 0;
    const mergeRatio = totalPRsSearch > 0 ? Math.round((mergedPRs / totalPRsSearch) * 100) : null;

    // --- Active days heatmap for chart
    const monthlyActivity = {};
    days.forEach(d => {
      const month = d.date.slice(0, 7);
      monthlyActivity[month] = (monthlyActivity[month] || 0) + d.contributionCount;
    });
    const activityByMonth = Object.entries(monthlyActivity)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month: month.slice(5), count }));

    return {
      consistencyScore,
      collabScore,
      osScore,
      diversityScore,
      mergeRatio,
      activeDays,
      longestStreak: streak,
      totalCommits,
      totalPRs,
      totalReviews,
      totalIssues,
      activityByMonth,
      langBreakdown: Object.entries(langs).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    };
  }

  /** ── Full dashboard ─────────────────────────────────────────────────── */
  static async getDashboard(userId) {
    const { token, username } = await this.#getToken(userId);
    console.log(`[GitHub] ▶ Dashboard for @${username}`);

    // Parallel fetch everything
    const [
      profile, orgs, repos, gists, starred,
      events, contributions,
      prs, issues,
    ] = await Promise.all([
      ghFetch(`${GH_API}/user`, token),
      ghFetch(`${GH_API}/user/orgs`, token, { per_page: 100 }),
      ghFetch(`${GH_API}/user/repos`, token, { per_page: 100, sort: "updated", type: "owner" }),
      ghFetch(`${GH_API}/users/${username}/gists`, token, { per_page: 30 }),
      ghFetch(`${GH_API}/user/starred`, token, { per_page: 30, sort: "created" }),
      ghFetch(`${GH_API}/users/${username}/events`, token, { per_page: 100 }),
      this.#fetchContributions(username, token),
      ghSearch(`author:${username} type:pr is:merged`, token),
      ghSearch(`author:${username} type:issue`, token),
    ]);

    // Per-repo language bytes (top 10 repos only, to avoid rate limit)
    const topRepos = (repos || []).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10);
    const repoLanguages = await Promise.all(
      topRepos.map(r => ghFetch(`${GH_API}/repos/${r.full_name}/languages`, token)
        .then(langs => ({ repo: r.name, langs: langs || {} })))
    );

    // Aggregate bytes across all repos
    const langBytes = {};
    repoLanguages.forEach(({ langs }) => {
      Object.entries(langs).forEach(([lang, bytes]) => {
        langBytes[lang] = (langBytes[lang] || 0) + bytes;
      });
    });
    const langByBytes = Object.entries(langBytes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, bytes]) => ({ name, bytes }));

    // Repo stats
    const ownedRepos   = (repos || []).filter(r => !r.fork);
    const forkedRepos  = (repos || []).filter(r => r.fork);
    const totalStars   = (repos || []).reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks   = (repos || []).reduce((s, r) => s + r.forks_count, 0);
    const topByStars   = [...(repos || [])].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10);
    const recentlyPushed = [...(repos || [])].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 5);

    // Starred repo topics analysis
    const starredTopics = {};
    const starredLangs  = {};
    (starred || []).forEach(r => {
      if (r.language) starredLangs[r.language] = (starredLangs[r.language] || 0) + 1;
      (r.topics || []).forEach(t => { starredTopics[t] = (starredTopics[t] || 0) + 1; });
    });

    // Compute derived metrics
    const metrics = this.#computeMetrics({ repos, contributions, events, prs, issues });

    console.log(`[GitHub] ✓ Complete`);

    return {
      profile,
      orgs:           orgs || [],
      repos:          repos || [],
      ownedRepos,
      forkedRepos,
      topByStars,
      recentlyPushed,
      totalStars,
      totalForks,
      langByBytes,
      repoLanguages,
      gists:          gists || [],
      starred:        starred || [],
      starredTopics:  Object.entries(starredTopics).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t, c]) => ({ topic: t, count: c })),
      starredLangs:   Object.entries(starredLangs).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count })),
      events:         events || [],
      contributions,
      prs:            prs || { total_count: 0, items: [] },
      issues:         issues || { total_count: 0, items: [] },
      metrics,
    };
  }

  static async getProfile(userId) {
    const { token } = await this.#getToken(userId);
    const [profile, orgs] = await Promise.all([
      ghFetch(`${GH_API}/user`, token),
      ghFetch(`${GH_API}/user/orgs`, token, { per_page: 100 }),
    ]);
    return { profile, orgs: orgs || [] };
  }

  static async getRepositories(userId) {
    const { token } = await this.#getToken(userId);
    const repos = await ghFetch(`${GH_API}/user/repos`, token, { per_page: 100, sort: "updated", type: "owner" });
    const totalStars = (repos || []).reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks = (repos || []).reduce((s, r) => s + r.forks_count, 0);
    const langs = {};
    (repos || []).forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    return {
      repos: repos || [],
      languages: Object.entries(langs).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      topByStars: [...(repos || [])].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10),
      totalStars, totalForks,
    };
  }

  static async getContributions(userId) {
    const { token, username } = await this.#getToken(userId);
    return this.#fetchContributions(username, token);
  }

  static async getActivity(userId) {
    const { token, username } = await this.#getToken(userId);
    const events = await ghFetch(`${GH_API}/users/${username}/events`, token, { per_page: 100 });
    return events || [];
  }
}

export default GitHubService;
