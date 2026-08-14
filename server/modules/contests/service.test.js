import { test, describe, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import ContestRepository from "./repository.js";
import ContestService from "./service.js";

describe("ContestService.syncCodeforcesContests phase reconciliation", () => {
  beforeEach(() => mock.restoreAll());

  test("a locally-tracked non-finished contest is reconciled to FINISHED even outside the 20-item window", async () => {
    const fetchContests = async () => [
      { id: 999, name: "Old Contest", phase: "FINISHED", startTimeSeconds: 1000, durationSeconds: 7200 },
      ...Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `New Contest ${index + 1}`,
        phase: "FINISHED",
        startTimeSeconds: 2000 + index,
        durationSeconds: 7200,
      })),
    ];
    mock.method(ContestRepository, "getNonFinishedContestIds", async () => new Set([999]));
    let upsertedDocs;
    mock.method(ContestRepository, "bulkUpsertContests", async (docs) => { upsertedDocs = docs; });
    mock.method(ContestRepository, "pruneStaleReminders", async () => {});

    await ContestService.syncCodeforcesContests({ fetchContests });

    const reconciled = upsertedDocs.find((d) => d.contestId === 999);
    assert.equal(reconciled?.phase, "FINISHED");
  });

  test("PENDING_SYSTEM_TEST and SYSTEM_TEST phases are both persisted, not dropped", async () => {
    const fetchContests = async () => [
      { id: 1, name: "Pending Test", phase: "PENDING_SYSTEM_TEST", startTimeSeconds: 1000, durationSeconds: 7200 },
      { id: 2, name: "System Test", phase: "SYSTEM_TEST", startTimeSeconds: 1000, durationSeconds: 7200 },
    ];
    mock.method(ContestRepository, "getNonFinishedContestIds", async () => new Set());
    let upsertedDocs;
    mock.method(ContestRepository, "bulkUpsertContests", async (docs) => { upsertedDocs = docs; });
    mock.method(ContestRepository, "pruneStaleReminders", async () => {});

    await ContestService.syncCodeforcesContests({ fetchContests });

    assert.deepEqual(
      upsertedDocs.map((doc) => doc.phase).sort(),
      ["PENDING_SYSTEM_TEST", "SYSTEM_TEST"]
    );
  });

  test("a newly-seen finished contest within the 20-item window is still persisted (retention path unaffected)", async () => {
    const fetchContests = async () => [
      { id: 2, name: "Recent Finished", phase: "FINISHED", startTimeSeconds: 5000, durationSeconds: 7200 },
    ];
    mock.method(ContestRepository, "getNonFinishedContestIds", async () => new Set());
    let upsertedDocs;
    mock.method(ContestRepository, "bulkUpsertContests", async (docs) => { upsertedDocs = docs; });
    mock.method(ContestRepository, "pruneStaleReminders", async () => {});

    await ContestService.syncCodeforcesContests({ fetchContests });

    assert.equal(upsertedDocs.length, 1);
    assert.equal(upsertedDocs[0].contestId, 2);
  });

  test("BEFORE and CODING phases pass through untouched, unaffected by reconciliation logic", async () => {
    const fetchContests = async () => [
      { id: 3, name: "Upcoming Contest", phase: "BEFORE", startTimeSeconds: 9999, durationSeconds: 7200 },
    ];
    mock.method(ContestRepository, "getNonFinishedContestIds", async () => new Set());
    let upsertedDocs;
    mock.method(ContestRepository, "bulkUpsertContests", async (docs) => { upsertedDocs = docs; });
    mock.method(ContestRepository, "pruneStaleReminders", async () => {});

    await ContestService.syncCodeforcesContests({ fetchContests });

    assert.equal(upsertedDocs[0].phase, "BEFORE");
  });
});

describe("ContestService reminder lifecycle", () => {
  beforeEach(() => mock.restoreAll());

  test("addReminder throws 404 when the contest does not exist", async () => {
    mock.method(ContestRepository, "findByContestId", async () => null);

    await assert.rejects(
      ContestService.addReminder("user1", 999),
      (err) => {
        assert.equal(err.statusCode, 404);
        return true;
      }
    );
  });

  test("addReminder throws 400 when the contest is not BEFORE/CODING (e.g. FINISHED)", async () => {
    mock.method(ContestRepository, "findByContestId", async () => ({
      name: "Old Round",
      phase: "FINISHED",
    }));

    await assert.rejects(
      ContestService.addReminder("user1", 1),
      (err) => {
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  test("addReminder throws 400 for a contest mid system-test, not just FINISHED", async () => {
    mock.method(ContestRepository, "findByContestId", async () => ({
      name: "Testing Round",
      phase: "SYSTEM_TEST",
    }));

    await assert.rejects(
      ContestService.addReminder("user1", 1),
      (err) => {
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  test("addReminder succeeds for a BEFORE-phase contest and persists it", async () => {
    mock.method(ContestRepository, "findByContestId", async () => ({
      name: "Upcoming Round",
      phase: "BEFORE",
    }));
    let persistedArgs;
    mock.method(ContestRepository, "addReminder", async (...args) => {
      persistedArgs = args;
    });

    const result = await ContestService.addReminder("user1", 42);

    assert.deepEqual(persistedArgs, ["user1", "codeforces", 42]);
    assert.match(result.message, /Upcoming Round/);
  });

  test("removeReminder delegates to the repository with the correct arguments", async () => {
    let calledWith;
    mock.method(ContestRepository, "removeReminder", async (...args) => {
      calledWith = args;
    });

    const result = await ContestService.removeReminder("user1", 42);

    assert.deepEqual(calledWith, ["user1", "codeforces", 42]);
    assert.equal(result.contestId, 42);
  });

  test("markReminderNotified delegates to the repository with the correct arguments", async () => {
    let calledWith;
    mock.method(ContestRepository, "markNotified", async (...args) => {
      calledWith = args;
    });

    const result = await ContestService.markReminderNotified("user1", 42);

    assert.deepEqual(calledWith, ["user1", "codeforces", 42]);
    assert.equal(result.contestId, 42);
  });
});
