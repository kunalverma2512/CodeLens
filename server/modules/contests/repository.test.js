import { test, describe, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import Contest from "../../models/Contest.js";
import ContestReminder from "../../models/ContestReminder.js";
import ContestRepository from "./repository.js";

describe("ContestRepository.addReminder idempotency", () => {
  beforeEach(() => mock.restoreAll());

  test("uses an upsert with $setOnInsert so calling it twice for the same reminder does not duplicate or overwrite", async () => {
    let capturedFilter, capturedUpdate, capturedOptions;
    mock.method(ContestReminder, "findOneAndUpdate", async (filter, update, options) => {
      capturedFilter = filter;
      capturedUpdate = update;
      capturedOptions = options;
      return { user: filter.user, platform: filter.platform, contestId: filter.contestId };
    });

    await ContestRepository.addReminder("user1", "codeforces", 42);

    assert.deepEqual(capturedFilter, { user: "user1", platform: "codeforces", contestId: 42 });
    assert.ok(capturedUpdate.$setOnInsert, "expected $setOnInsert so a repeat call is a no-op, not an overwrite");
    assert.equal(capturedOptions.upsert, true);
  });
});

describe("ContestRepository.getUpcomingContests", () => {
  beforeEach(() => mock.restoreAll());

  test("filters to BEFORE/CODING/testing phases and sorts ascending by start time", async () => {
    let capturedFilter, capturedSort;
    const chain = {
      sort: (sortArg) => { capturedSort = sortArg; return chain; },
      lean: async () => [],
    };
    mock.method(Contest, "find", (filter) => { capturedFilter = filter; return chain; });

    await ContestRepository.getUpcomingContests("codeforces");

    assert.equal(capturedFilter.platform, "codeforces");
    assert.deepEqual(
      capturedFilter.phase.$in.slice().sort(),
      ["BEFORE", "CODING", "PENDING_SYSTEM_TEST", "SYSTEM_TEST"].sort()
    );
    assert.deepEqual(capturedSort, { startTimeSeconds: 1 });
  });
});

describe("ContestRepository.getActiveReminderContests", () => {
  beforeEach(() => mock.restoreAll());

  test("joins reminders to their contest docs, attaches notifiedAt, and drops reminders for contests no longer BEFORE/CODING", async () => {
    mock.method(ContestReminder, "find", () => ({
      lean: async () => [
        { contestId: 1, notifiedAt: null },
        { contestId: 2, notifiedAt: new Date("2026-01-01") },
        { contestId: 3, notifiedAt: null }, // this contest has since finished — should be excluded
      ],
    }));
    mock.method(Contest, "find", () => ({
      lean: async () => [
        { contestId: 1, name: "Round A", startTimeSeconds: 200 },
        { contestId: 2, name: "Round B", startTimeSeconds: 100 },
        // contestId 3 intentionally absent — Contest.find's own phase
        // filter already excludes it, simulating a since-finished contest.
      ],
    }));

    const result = await ContestRepository.getActiveReminderContests("user1", "codeforces");

    assert.equal(result.length, 2);
    // Sorted ascending by startTimeSeconds.
    assert.deepEqual(result.map((r) => r.contestId), [2, 1]);
    assert.equal(result.find((r) => r.contestId === 2).notifiedAt.toISOString(), new Date("2026-01-01").toISOString());
    assert.equal(result.find((r) => r.contestId === 1).notifiedAt, null);
  });

  test("returns an empty array without querying Contest at all when the user has no reminders", async () => {
    mock.method(ContestReminder, "find", () => ({ lean: async () => [] }));
    let contestFindCalled = false;
    mock.method(Contest, "find", () => { contestFindCalled = true; return { lean: async () => [] }; });

    const result = await ContestRepository.getActiveReminderContests("user1", "codeforces");

    assert.deepEqual(result, []);
    assert.equal(contestFindCalled, false);
  });
});

describe("ContestRepository.pruneStaleReminders", () => {
  beforeEach(() => mock.restoreAll());

  test("deletes reminders for contests outside BEFORE/CODING", async () => {
    mock.method(Contest, "find", () => ({
      select: () => ({ lean: async () => [{ contestId: 7 }, { contestId: 9 }] }),
    }));
    let deleteFilter;
    mock.method(ContestReminder, "deleteMany", async (filter) => { deleteFilter = filter; });

    await ContestRepository.pruneStaleReminders("codeforces");

    assert.equal(deleteFilter.platform, "codeforces");
    assert.deepEqual(deleteFilter.contestId.$in.slice().sort(), [7, 9]);
  });

  test("does not call deleteMany at all when there are no stale contests", async () => {
    mock.method(Contest, "find", () => ({
      select: () => ({ lean: async () => [] }),
    }));
    let deleteManyCalled = false;
    mock.method(ContestReminder, "deleteMany", async () => { deleteManyCalled = true; });

    await ContestRepository.pruneStaleReminders("codeforces");

    assert.equal(deleteManyCalled, false);
  });
});
