import mongoose from "mongoose";

/**
 * Caches the Codeforces `contest.list` API response so the frontend never
 * has to hit Codeforces directly (avoids rate-limiting, keeps load times fast).
 * Refreshed hourly by `server/jobs/contestSync.js`.
 */
const ContestSchema = new mongoose.Schema(
  {
    // NOTE: no standalone index on `platform` here. Every current query
    // filters on platform ALONGSIDE contestId or phase in the same query
    // (see repository.js) — never on platform alone. The compound unique
    // index below already covers platform via its leftmost-prefix
    // behavior for any query that touches it, so a separate index here
    // would be redundant. See INDEXES.md for the full rationale.
    platform: {
      type: String,
      enum: ["codeforces"],
      default: "codeforces",
      required: true,
    },
    // NOTE: no standalone index here either, for the same reason — every
    // query that filters on contestId also filters on platform in the
    // same query (findByContestId, bulkUpsertContests' upsert filter),
    // which the compound unique index below already fully covers.
    contestId: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, default: "CF" },
    phase: { type: String, required: true, index: true },
    division: { type: String, default: "Other" },
    durationSeconds: { type: Number, required: true },
    startTimeSeconds: { type: Number, required: true, index: true },
    relativeTimeSeconds: { type: Number },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ContestSchema.index({ platform: 1, contestId: 1 }, { unique: true });

export default mongoose.model("Contest", ContestSchema);
