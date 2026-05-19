import { GoogleGenAI } from "@google/genai";
import CodeforcesProfile from "../../models/CodeforcesProfile.js";
import CodeforcesRatingHistory from "../../models/CodeforcesRatingHistory.js";
import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";

// ── Gemini client (new SDK) ───────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Prompt builders ───────────────────────────────────────────────────────────

const buildPrompt = (userData) => {
  const { profile, recentContests, name } = userData;

  const cfBlock = profile
    ? `
CODEFORCES TELEMETRY:
- Handle: ${profile.handle}
- Current Rating: ${profile.rating} (${profile.rank})
- Peak Rating: ${profile.maxRating} (${profile.maxRank})
- Total Problems Solved: ${profile.stats?.totalSolved ?? 0}
- Total Submissions: ${profile.stats?.totalSubmissions ?? 0}
- Acceptance Rate: ${profile.stats?.successRate ?? 0}%
- Wrong Answers: ${profile.stats?.wrongAnswers ?? 0}
- Time Limit Exceeded: ${profile.stats?.timeLimitExceeded ?? 0}
- Runtime Errors: ${profile.stats?.runtimeErrors ?? 0}
- Contests Participated: ${profile.stats?.contestsParticipated ?? 0}
- Best Contest Rank: ${profile.stats?.bestRank ?? "N/A"}
- Current Streak: ${profile.stats?.currentStreak ?? 0} days
- Longest Streak: ${profile.stats?.longestStreak ?? 0} days
- Top Tags Solved: ${
        Object.entries(
          profile.stats?.byTag instanceof Map
            ? Object.fromEntries(profile.stats.byTag)
            : profile.stats?.byTag || {}
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([tag, count]) => `${tag}(${count})`)
          .join(", ") || "No data yet"
      }
- Difficulty Distribution: ${
        Object.entries(profile.stats?.byRating || {})
          .filter(([, v]) => v > 0)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([r, c]) => `${r === "2500plus" ? "2500+" : r}(${c})`)
          .join(", ") || "No data yet"
      }
- Last 5 Contests: ${
        recentContests.length
          ? recentContests
              .slice(0, 5)
              .map(
                (c) =>
                  `[${c.contestName?.slice(0, 35)}]: ${c.oldRating}→${c.newRating} rank#${c.rank}`
              )
              .join(" | ")
          : "No contest history"
      }
`.trim()
    : "CODEFORCES: Not connected. Provide general advice for a developer starting competitive programming.";

  return `
You are a brutally honest, world-class competitive programming coach and Staff Engineer.
Your job is to give SPECIFIC, DATA-DRIVEN, ACTIONABLE advice based on REAL performance numbers.
Do NOT give generic advice. Reference the actual stats provided.

Analyze this developer and write a growth insight in exactly 3 paragraphs:

PARAGRAPH 1 — DIAGNOSIS: Identify the single most critical weakness or pattern from their data. Be specific with numbers.
PARAGRAPH 2 — PRESCRIPTION: Give ONE precise action to take in the next 48 hours. Name specific algorithm tags, rating ranges, or problem types that target the weakness.
PARAGRAPH 3 — TRAJECTORY: State the exact milestone they will reach in a realistic timeframe if they execute the prescription.

Rules:
- No bullet points. Flowing prose only.
- No generic advice. Every sentence must reference their actual data.
- Tone: Direct, confident, like a mentor who never sugarcoats.
- Separate paragraphs with a blank line.
- Do not use any headers or labels.

Developer: ${name || "Engineer"}

${cfBlock}

Write the insight now:
`.trim();
};

// ── Service ───────────────────────────────────────────────────────────────────

class AiService {
  /**
   * Generates a personalized insight using Gemini 2.5 Flash and streams it via SSE.
   */
  static async streamInsight(userId, res) {
    console.log(`\n[AI] ▶ Insight request for userId: ${userId}`);
    console.log(`[AI] ▶ Fetching user data from DB...`);

    // 1. Fetch user context
    const [user, cfProfile, recentContests] = await Promise.all([
      User.findById(userId).select("name email").lean(),
      CodeforcesProfile.findOne({ user: userId, isVerified: true }).lean(),
      CodeforcesRatingHistory.find({ user: userId })
        .sort({ ratingUpdateTimeSeconds: -1 })
        .limit(5)
        .lean(),
    ]);

    if (!user) throw new ApiError(401, "User not found.");

    console.log(`[AI] ✓ User: ${user.name} | CF Connected: ${!!cfProfile} | Contests: ${recentContests.length}`);

    // 2. Set SSE headers BEFORE any async work so the client starts listening
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    // 3. Build prompt
    const prompt = buildPrompt({ profile: cfProfile, recentContests, name: user.name });

    console.log(`[AI] ▶ Sending prompt to Gemini 2.5 Flash (${prompt.length} chars)...`);

    // 4. Call Gemini
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = result.text;

      console.log(`[AI] ✓ Gemini responded (${text?.length ?? 0} chars)`);

      if (!text || !text.trim()) {
        console.warn(`[AI] ⚠ Empty response from Gemini`);
        res.write(`data: ${JSON.stringify({ error: "No insight generated. Try again." })}\n\n`);
        res.end();
        return;
      }

      // 5. Simulate streaming — send in chunks so the UI animates
      //    (Gemini non-streaming SDK returns all at once; we chunk for UX)
      const cleaned = text.trim();
      const CHUNK_SIZE = 12; // characters per "tick"
      const DELAY_MS = 18;   // ms between ticks

      console.log(`[AI] ▶ Streaming ${cleaned.length} chars to client in chunks of ${CHUNK_SIZE}...`);

      let i = 0;
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (i >= cleaned.length) {
            clearInterval(interval);
            resolve();
            return;
          }
          const slice = cleaned.slice(i, i + CHUNK_SIZE);
          res.write(`data: ${JSON.stringify({ content: slice })}\n\n`);
          i += CHUNK_SIZE;
        }, DELAY_MS);
      });

      // 6. Send done signal
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      console.log(`[AI] ✓ Stream complete`);
    } catch (err) {
      console.error(`[AI] ✗ Gemini error:`, err.message);
      res.write(`data: ${JSON.stringify({ error: "AI service temporarily unavailable. Check server logs." })}\n\n`);
    } finally {
      res.end();
    }
  }

  /**
   * Fetches the cached dashboard summary or generates a new one.
   */
  static async getDashboardSummary(userId) {
    // 1. Fetch user to check cache
    const user = await User.findById(userId).select("name email dashboardSummary").lean();
    if (!user) throw new ApiError(401, "User not found.");

    // 2. Return cached summary if it exists
    if (user.dashboardSummary && user.dashboardSummary.content) {
      return user.dashboardSummary.content;
    }

    console.log(`[AI] ▶ No cached summary found for ${user.name}. Generating new summary...`);

    // 3. Fetch data for generation
    const [cfProfile, recentContests] = await Promise.all([
      CodeforcesProfile.findOne({ user: userId, isVerified: true }).lean(),
      CodeforcesRatingHistory.find({ user: userId })
        .sort({ ratingUpdateTimeSeconds: -1 })
        .limit(5)
        .lean(),
    ]);

    const prompt = buildPrompt({ profile: cfProfile, recentContests, name: user.name });

    // 4. Generate new summary
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text?.trim();
    if (!text) throw new ApiError(500, "Failed to generate AI summary.");

    // 5. Cache it in DB
    await User.findByIdAndUpdate(userId, {
      "dashboardSummary.content": text,
      "dashboardSummary.lastGeneratedAt": new Date()
    });

    console.log(`[AI] ✓ Summary generated and cached for ${user.name}.`);
    return text;
  }
}

export default AiService;
