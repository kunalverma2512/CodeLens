import { GoogleGenAI } from "@google/genai";
import CodeforcesProfile from "../../models/CodeforcesProfile.js";
import CodeforcesRatingHistory from "../../models/CodeforcesRatingHistory.js";
import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";
import ApexConversation from "../../models/ApexConversation.js";
import { compileUserContext } from "../../utils/apexContextCompiler.js";

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

// ── APEX System Prompt Builder ────────────────────────────────────────────────

/**
 * Builds the system prompt for an APEX conversation.
 * This is set ONCE per conversation and gives Gemini its full persona
 * and the pre-compiled user intelligence context.
 *
 * @param {string} contextPromptBlock - Pre-formatted user context string from apexContextCompiler
 */
const buildApexSystemPrompt = (contextPromptBlock) => `
You are APEX — an advanced AI career intelligence embedded inside CodeLens, a developer analytics platform.

Your role is to serve as a brutally honest, deeply technical, and highly personalized advisor.
You have access to REAL performance data for this specific user. Always reference their actual data.

WHAT YOU DO:
1. SKILL TRUTH ANALYSIS: Tell the user exactly where they stand based on their actual data.
   - Use the skill decay scores to identify what they THINK they know vs. what they actually practice.
   - A topic with many solves but a long gap since last practice = rusty, be honest about this.

2. PROJECT GUIDANCE: When asked "how do I build X", respond with a structured milestone plan.
   Format: MILESTONE 1 (Day X-Y): [specific task] — never give vague walls of text.
   Tailor the project complexity to the user's actual skill level from their data.

3. CP STRATEGY: Give specific, data-driven contest preparation advice.
   Reference their rating trajectory, rustiest tags, and consistency pattern.

4. CAREER GUIDANCE: Help them understand how their current trajectory maps to real-world opportunities.

RULES:
- Never make up statistics. If data is unavailable for something, say "I don't have data on that yet."
- No generic advice. Every meaningful statement must either reference their data or be explicitly general.
- Tone: Direct, confident, like a senior engineer who respects the user enough to be honest.
- For milestone/project answers: Always use the format "MILESTONE N (Day X-Y): [task]"
- Keep responses focused and structured. Avoid walls of text.
- Do NOT use excessive bullet points for conversational responses. Use prose.
- You remember everything said in this conversation — refer back to earlier context naturally.

${contextPromptBlock}

You are now ready to assist. Wait for the user's first message.
`.trim();

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

  // ══════════════════════════════════════════════════════════════════════════
  // APEX CHAT METHODS (multi-turn conversational AI)
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a brand-new APEX conversation for a user.
   * Compiles fresh user context once and stores it in the conversation document
   * so it is reused for every subsequent message in this session.
   *
   * Returns the created conversation document (without messages for brevity).
   */
  static async createConversation(userId) {
    // 1. Compile fresh context — reads CF, GitHub, goals from DB
    const { raw, promptBlock } = await compileUserContext(userId);

    // 2. Create the conversation document
    const conversation = await ApexConversation.create({
      user: userId,
      title: "New Conversation",
      messages: [],
      contextSnapshot: raw,
      contextPromptBlock: promptBlock,
    });

    console.log(`[APEX] ✓ Conversation created: ${conversation._id} for user ${userId}`);

    // 3. Return lean doc (sidebar-safe: no messages array bloat)
    return {
      _id: conversation._id,
      title: conversation.title,
      pinned: conversation.pinned,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Returns all non-deleted conversations for a user, sorted newest-first.
   * Lean projection: only fields needed for the sidebar.
   */
  static async listConversations(userId) {
    const conversations = await ApexConversation.find(
      { user: userId, isDeleted: false },
      {
        title: 1,
        pinned: 1,
        createdAt: 1,
        updatedAt: 1,
        // Last message preview — computed below after fetch
        messages: { $slice: -1 }, // Only pull the very last message for preview
      }
    )
      .sort({ pinned: -1, updatedAt: -1 }) // Pinned first, then newest
      .lean();

    // Attach a short preview of the last message
    return conversations.map((conv) => ({
      _id: conv._id,
      title: conv.title,
      pinned: conv.pinned,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessagePreview: conv.messages?.[0]?.content?.slice(0, 80) ?? null,
      lastMessageRole: conv.messages?.[0]?.role ?? null,
    }));
  }

  /**
   * Loads a specific conversation's full message history.
   * Auth-gated: throws 403 if the requesting user doesn't own this conversation.
   */
  static async loadConversation(conversationId, userId) {
    const conversation = await ApexConversation.findOne({
      _id: conversationId,
      isDeleted: false,
    }).lean();

    if (!conversation) {
      throw new ApiError(404, "Conversation not found.");
    }

    // Ownership check — critical security guard
    if (conversation.user.toString() !== userId.toString()) {
      throw new ApiError(403, "You do not have access to this conversation.");
    }

    return {
      _id: conversation._id,
      title: conversation.title,
      pinned: conversation.pinned,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Soft-deletes a conversation.
   * Auth-gated: throws 403 if the requesting user doesn't own this conversation.
   */
  static async deleteConversation(conversationId, userId) {
    const conversation = await ApexConversation.findOne({
      _id: conversationId,
      isDeleted: false,
    });

    if (!conversation) {
      throw new ApiError(404, "Conversation not found.");
    }

    if (conversation.user.toString() !== userId.toString()) {
      throw new ApiError(403, "You do not have access to this conversation.");
    }

    conversation.isDeleted = true;
    await conversation.save();

    console.log(`[APEX] ✓ Conversation soft-deleted: ${conversationId}`);
    return { deleted: true };
  }

  /**
   * The core APEX chat method.
   *
   * Flow:
   *   1. Load conversation + verify ownership
   *   2. Append user message to history
   *   3. Auto-generate title from first message (if still "New Conversation")
   *   4. Build the full Gemini multi-turn payload:
   *        - System prompt (APEX persona + user context snapshot)
   *        - History (all previous turns in Gemini format)
   *        - New user message
   *   5. Call Gemini with streaming
   *   6. Stream chunks to client via SSE
   *   7. After stream completes, save the full assistant reply to the DB
   *
   * @param {string} conversationId
   * @param {string} userId
   * @param {string} userMessage
   * @param {import('express').Response} res - Express response object for SSE
   */
  static async sendMessage(conversationId, userId, userMessage, res) {
    // ── 1. Load and verify conversation ──────────────────────────────────────
    const conversation = await ApexConversation.findOne({
      _id: conversationId,
      isDeleted: false,
    });

    if (!conversation) throw new ApiError(404, "Conversation not found.");
    if (conversation.user.toString() !== userId.toString()) {
      throw new ApiError(403, "You do not have access to this conversation.");
    }

    // ── 2. Append user message to DB immediately ──────────────────────────────
    const userMsg = { role: "user", content: userMessage.trim() };
    conversation.messages.push(userMsg);

    // ── 3. Auto-generate title from first message ─────────────────────────────
    if (conversation.title === "New Conversation") {
      conversation.generateTitle(userMessage);
    }

    await conversation.save();

    // ── 4. Build Gemini payload ───────────────────────────────────────────────

    // System prompt: APEX persona + the pre-compiled user context block
    const systemPrompt = buildApexSystemPrompt(conversation.contextPromptBlock);

    // Convert stored messages (excluding the just-added one) to Gemini history format
    // We pass all messages EXCEPT the last one (the current user message) as history
    const historyMessages = conversation.messages.slice(0, -1);
    const geminiHistory = historyMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // ── 5. Set SSE headers ────────────────────────────────────────────────────
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    // ── 6. Stream from Gemini ─────────────────────────────────────────────────
    let fullAssistantReply = "";

    try {
      console.log(`[APEX] ▶ sendMessage: conv=${conversationId} | history=${geminiHistory.length} turns | msg="${userMessage.slice(0, 60)}..."`);

      const result = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: [
          ...geminiHistory,
          { role: "user", parts: [{ text: userMessage }] },
        ],
      });

      // Stream each chunk to the client as an SSE event
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullAssistantReply += text;
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }

      console.log(`[APEX] ✓ Stream complete (${fullAssistantReply.length} chars)`);

      // ── 7. Save completed assistant reply to DB ───────────────────────────
      if (fullAssistantReply.trim()) {
        conversation.messages.push({
          role: "assistant",
          content: fullAssistantReply.trim(),
        });
        await conversation.save();
        console.log(`[APEX] ✓ Assistant reply saved to conversation ${conversationId}`);
      }

      // Send done signal so the client knows the stream is complete
      res.write(`data: ${JSON.stringify({ done: true, title: conversation.title })}\n\n`);

    } catch (err) {
      console.error(`[APEX] ✗ Gemini streaming error:`, err.message);
      res.write(`data: ${JSON.stringify({ error: "APEX is temporarily unavailable. Please try again." })}\n\n`);
    } finally {
      res.end();
    }
  }
}

export default AiService;

