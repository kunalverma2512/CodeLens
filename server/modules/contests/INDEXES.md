# Contest collection index rationale

This documents why each index on the `contests` collection exists, so future
changes can evaluate additions/removals against actual query patterns
instead of adding indexes defensively.

## Current indexes

| Index | Backs |
|---|---|
| `{ platform: 1, contestId: 1 }` (unique) | `findByContestId` and `bulkUpsertContests`'s upsert filter (repository.js) always filter on `platform` + `contestId` together — this index serves both. It also enforces the one-document-per-(platform, contestId) invariant. Its leftmost prefix (`platform`) additionally covers any query that filters on `platform` alone, though no such query currently exists (see below). |
| `{ phase: 1 }` | `getUpcomingContests`, `getNonFinishedContestIds`, `pruneStaleReminders`, `getActiveReminderContests` all filter on `phase`. Note: this is a single-field index, not part of a compound index with `platform` — `{ platform: 1, contestId: 1 }` does not include `phase`, so queries filtering on both `platform` and `phase` currently use the `phase` index (or the planner's choice between the two single-field indexes), not the compound one. See "Future consideration" below for a compound index that would serve this shape directly. |
| `{ startTimeSeconds: 1 }` | `getUpcomingContests`'s sort, and range queries if added later (e.g. "contests starting in the next N hours"). |

## What was removed and why

Two standalone indexes previously existed alongside the compound unique
`{ platform: 1, contestId: 1 }` index:

- **`{ contestId: 1 }`** - no query in the codebase ever filters on
  `contestId` without also filtering on `platform` in the same query. The
  compound index already covers every such lookup.
- **`{ platform: 1 }`** - likewise, no query filters on `platform` alone;
  every `Contest.find`/`findOne` call in `repository.js` filters on
  `platform` combined with either `contestId` or `phase`. The compound
  index's leftmost-prefix property means MongoDB can already use it for a
  platform-only query if one is ever added, without needing a dedicated
  single-field index for it today.

Both added write overhead (one more index entry to maintain per
insert/upsert) without ever being an index the query planner would choose
over the existing ones for the queries this codebase actually runs.

## Applying this in an already-deployed environment

Changing the Mongoose schema does **not** drop an index from an existing
database, indexes are a database-level construct, and Mongoose's
`autoIndex` (used in dev) only ever *adds* missing indexes, it never drops
ones no longer declared in the schema. To remove both standalone indexes
from a real deployment, run the migration script once against that
environment, from the **repository root**:

```bash
node server/scripts/dropRedundantContestIndex.js
```

It's idempotent, safe to run again if the indexes are already gone. It
also refuses to run (throws, does not drop anything) if the compound
unique `{ platform: 1, contestId: 1 }` index isn't present, since dropping
the standalone indexes without that replacement in place would leave
`platform`/`contestId` lookups unindexed and remove the uniqueness
guarantee.

## Future consideration (not applied in this change)

`getUpcomingContests` filters on `{ platform, phase }` and sorts on
`startTimeSeconds`, a compound index `{ platform: 1, phase: 1,
startTimeSeconds: 1 }` would let MongoDB satisfy that entire query
(filter + sort) from a single index scan, rather than choosing between the
separate `phase` and `startTimeSeconds` indexes. This wasn't rolled into
this change since it requires validating against real query volume /
`explain()` output in a representative environment rather than reasoning
about it in the abstract, flagged here for whoever picks up index tuning
next.
