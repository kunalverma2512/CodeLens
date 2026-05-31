import mongoose from "mongoose";

// ── Message sub-schema ────────────────────────────────────────────────────────
// Represents a single turn in the conversation (either user or assistant).
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false, // No separate _id per message — keeps documents lean
    timestamps: { createdAt: "timestamp", updatedAt: false }, // Only record when message was created
  }
);

// ── Main conversation schema ──────────────────────────────────────────────────
const apexConversationSchema = new mongoose.Schema(
  {
    // The owner — only this user can read or write to this conversation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Auto-generated from the first user message (first 6-8 words)
    // Displayed in the sidebar conversation list
    title: {
      type: String,
      default: "New Conversation",
      trim: true,
      maxlength: 100,
    },

    // The actual chat turns, ordered chronologically
    messages: {
      type: [messageSchema],
      default: [],
    },

    // A snapshot of the user's compiled context AT THE TIME this conversation
    // was created. Stored so that:
    //   1. Historical conversations make sense even as stats evolve
    //   2. We don't re-compile context on every message (perf win)
    contextSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // The formatted string version of contextSnapshot injected into the system prompt.
    // Pre-computed once on conversation creation and reused for all messages in this session.
    contextPromptBlock: {
      type: String,
      default: "",
    },

    // User can pin important conversations so they stay at the top of the sidebar
    pinned: {
      type: Boolean,
      default: false,
    },

    // Soft delete — we mark as deleted rather than removing from DB.
    // Allows potential recovery and avoids accidental permanent loss.
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Compound index: fetch all non-deleted conversations for a user, sorted by most recent
apexConversationSchema.index({ user: 1, isDeleted: 1, updatedAt: -1 });

// ── Instance helpers ──────────────────────────────────────────────────────────

/**
 * Returns the last N messages from this conversation formatted
 * for Gemini's multi-turn `contents` array format.
 *
 * Gemini expects: [{ role: "user"|"model", parts: [{ text: "..." }] }]
 * Note: Gemini uses "model" not "assistant" — we translate here.
 */
apexConversationSchema.methods.getGeminiHistory = function (limit = 20) {
  const recent = this.messages.slice(-limit);
  return recent.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
};

/**
 * Auto-generates a title from the first user message if the title is still default.
 * Takes the first 8 words and appends "..." if truncated.
 */
apexConversationSchema.methods.generateTitle = function (firstUserMessage) {
  if (this.title !== "New Conversation") return; // Already has a custom title
  const words = firstUserMessage.trim().split(/\s+/).slice(0, 8);
  this.title =
    words.length < firstUserMessage.trim().split(/\s+/).length
      ? words.join(" ") + "..."
      : words.join(" ");
};

export default mongoose.model("ApexConversation", apexConversationSchema);
