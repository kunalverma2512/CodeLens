import mongoose from "mongoose";
import "../config/env.js";
import connectDB from "../config/db.js";

/**
 * One-off migration: drops redundant standalone indexes on the contests
 * collection (`contestId_1` and `platform_1`), if present. Both are fully
 * covered by the compound unique `{ platform: 1, contestId: 1 }` index via
 * its leftmost-prefix behavior — see INDEXES.md for the full rationale.
 *
 * Mongoose schema changes never automatically drop existing indexes in
 * production — this must be run explicitly against each environment
 * (staging, production) after the schema change deploys.
 *
 * Safe to run multiple times — it's a no-op for any index already gone.
 *
 * Usage (run from the repository root):
 *   node server/scripts/dropRedundantContestIndex.js
 */
const REDUNDANT_INDEX_KEYS = [{ contestId: 1 }, { platform: 1 }];
const REQUIRED_REPLACEMENT_KEY = { platform: 1, contestId: 1 };

const run = async () => {
  await connectDB();
  const collection = mongoose.connection.collection("contests");
  const indexes = await collection.indexes();

  // Refuse to drop anything unless the compound unique index that's meant
  // to replace these standalone ones is actually present. Without this
  // guard, a drifted database (e.g. someone dropped the compound index
  // manually, or it failed to build) could lose lookup coverage and the
  // one-document-per-(platform, contestId) uniqueness guarantee entirely.
  const compoundUnique = indexes.find(
    (idx) =>
      JSON.stringify(idx.key) === JSON.stringify(REQUIRED_REPLACEMENT_KEY) &&
      idx.unique === true
  );

  if (!compoundUnique) {
    throw new Error(
      "Refusing to drop redundant contest indexes: the required compound " +
        "unique index { platform: 1, contestId: 1 } was not found. Investigate " +
        "before re-running this migration — dropping the standalone indexes " +
        "without it in place would leave contestId/platform lookups unindexed."
    );
  }

  for (const key of REDUNDANT_INDEX_KEYS) {
    const match = indexes.find((idx) => JSON.stringify(idx.key) === JSON.stringify(key));
    if (match) {
      await collection.dropIndex(match.name);
      console.log(`Dropped redundant index: ${match.name}`);
    } else {
      console.log(`No index found for ${JSON.stringify(key)} — nothing to do.`);
    }
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Failed to drop index:", err);
  process.exit(1);
});
