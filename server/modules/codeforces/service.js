import crypto from "crypto";
import ApiError from "../../utils/ApiError.js";
import CodeforcesRepository from "./repository.js";
import {
  cfGetUserInfo,
  cfGetUserRating,
  cfGetUserStatus,
} from "../../utils/codeforcesApi.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a unique 8-char alphanumeric code for surname verification.
 */
const generateVerificationCode = () =>
  crypto.randomBytes(5).toString("hex").toUpperCase().slice(0, 8);

/**
 * Computes the activity heatmap and streak from raw submissions.
 * Returns { dailyActivity, currentStreak, longestStreak }
 */
const computeActivityData = (submissions) => {
  const dailyActivity = {};

  for (const sub of submissions) {
    const date = new Date(sub.creationTimeSeconds * 1000)
      .toISOString()
      .slice(0, 10); // "YYYY-MM-DD"
    dailyActivity[date] = (dailyActivity[date] || 0) + 1;
  }

  // Compute streak
  const dates = Object.keys(dailyActivity).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().slice(0, 10);
  const sortedDesc = [...dates].reverse();

  for (let i = 0; i < sortedDesc.length; i++) {
    const expected = new Date(Date.now() - i * 86_400_000)
      .toISOString()
      .slice(0, 10);
    if (sortedDesc[i] === expected) {
      currentStreak++;
    } else {
      break;
    }
  }

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr - prev) / 86_400_000;
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { dailyActivity, currentStreak, longestStreak };
};

/**
 * Aggregates full submission array into stats buckets.
 */
const computeStats = (submissions) => {
  const stats = {
    totalSubmissions: submissions.length,
    acceptedSubmissions: 0,
    wrongAnswers: 0,
    timeLimitExceeded: 0,
    runtimeErrors: 0,
    compilationErrors: 0,
    byRating: {},
    byTag: {},
    byVerdict: {},
    byLanguage: {},
    solvedSet: new Set(),
  };

  for (const sub of submissions) {
    const verdict = sub.verdict;

    // Verdict counts
    stats.byVerdict[verdict] = (stats.byVerdict[verdict] || 0) + 1;
    if (verdict === "OK") stats.acceptedSubmissions++;
    else if (verdict === "WRONG_ANSWER") stats.wrongAnswers++;
    else if (verdict === "TIME_LIMIT_EXCEEDED") stats.timeLimitExceeded++;
    else if (verdict === "RUNTIME_ERROR") stats.runtimeErrors++;
    else if (verdict === "COMPILATION_ERROR") stats.compilationErrors++;

    // Language counts
    if (sub.programmingLanguage) {
      stats.byLanguage[sub.programmingLanguage] =
        (stats.byLanguage[sub.programmingLanguage] || 0) + 1;
    }

    // Solved problem deduplication
    if (verdict === "OK" && sub.problem) {
      const key = `${sub.problem.contestId || ""}_${sub.problem.index || ""}`;
      if (!stats.solvedSet.has(key)) {
        stats.solvedSet.add(key);

        // By difficulty rating
        const r = sub.problem.rating;
        if (r) {
          const bucket =
            r >= 2500
              ? "2500plus"
              : String(Math.floor(r / 100) * 100);
          stats.byRating[bucket] = (stats.byRating[bucket] || 0) + 1;
        } else {
          stats.byRating["unrated"] = (stats.byRating["unrated"] || 0) + 1;
        }

        // By tag
        for (const tag of sub.problem.tags || []) {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
        }
      }
    }
  }

  const totalSolved = stats.solvedSet.size;
  const successRate =
    stats.totalSubmissions > 0
      ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
      : 0;

  delete stats.solvedSet;
  return { ...stats, totalSolved, successRate };
};

// ── Service Class ─────────────────────────────────────────────────────────────

class CodeforcesService {
  /**
   * Step 1: User provides their handle.
   * We verify it exists on CF and generate a surname verification code.
   */
  static async initiateConnection(userId, handle) {
    // 1. Validate handle exists on Codeforces
    let cfUsers;
    try {
      cfUsers = await cfGetUserInfo(handle);
    } catch (err) {
      throw new ApiError(404, `Codeforces handle "${handle}" not found.`);
    }

    const cfUser = cfUsers[0];
    if (!cfUser) {
      throw new ApiError(404, `Codeforces handle "${handle}" not found.`);
    }

    // 2. Check handle not already taken by another CodeLens user
    const existingProfile = await CodeforcesRepository.findProfileByHandle(handle.toLowerCase());
    if (existingProfile && String(existingProfile.user) !== String(userId)) {
      throw new ApiError(
        409,
        "This Codeforces handle is already connected to another account."
      );
    }

    // 3. Generate unique verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 4. Save minimal profile as "pending verification"
    await CodeforcesRepository.upsertProfile(userId, {
      user: userId,
      handle: handle.toLowerCase(),
      avatar: cfUser.avatar || "",
      titlePhoto: cfUser.titlePhoto || "",
      firstName: cfUser.firstName,
      lastName: cfUser.lastName,
      rating: cfUser.rating || 0,
      maxRating: cfUser.maxRating || 0,
      rank: cfUser.rank || "unrated",
      maxRank: cfUser.maxRank || "unrated",
      isVerified: false,
      verificationCode,
      verificationExpiry,
    });

    return {
      handle,
      verificationCode,
      message: `Set your Codeforces Last Name to "${verificationCode}" and click Verify.`,
      expiresInMinutes: 15,
    };
  }

  /**
   * Step 2: User confirms they updated their surname.
   * We re-fetch from CF and compare the lastName field.
   */
  static async verifyConnection(userId, handle) {
    // 1. Fetch our pending profile
    const profile = await CodeforcesRepository.findProfileByUserId(userId);
    if (!profile || !profile.verificationCode) {
      throw new ApiError(400, "No pending verification. Please re-initiate connection.");
    }

    if (new Date() > profile.verificationExpiry) {
      throw new ApiError(400, "Verification code expired. Please re-initiate connection.");
    }

    // 2. Re-fetch from Codeforces
    let cfUsers;
    try {
      cfUsers = await cfGetUserInfo(handle);
    } catch {
      throw new ApiError(502, "Could not contact Codeforces API. Try again.");
    }

    const cfUser = cfUsers[0];
    const cfLastName = (cfUser.lastName || "").trim().toUpperCase();
    const expected = profile.verificationCode.toUpperCase();

    if (cfLastName !== expected) {
      throw new ApiError(
        400,
        `Verification failed. Your Codeforces Last Name is "${cfUser.lastName || "(empty)"}". Expected "${profile.verificationCode}".`
      );
    }

    // 3. Mark verified, clear verification code
    await CodeforcesRepository.upsertProfile(userId, {
      isVerified: true,
      verificationCode: null,
      verificationExpiry: null,
    });

    // 4. Update user handles
    await CodeforcesRepository.setUserCodeforcesHandle(userId, handle.toLowerCase());

    // 5. Trigger background full sync
    CodeforcesService.syncUserData(userId, handle).catch((err) =>
      console.error("[CF Sync Error]", err.message)
    );

    return {
      message: "Codeforces account connected successfully! Data is syncing in the background.",
      handle,
      isVerified: true,
    };
  }

  /**
   * Full data sync: fetch all submissions, rating history, and update stats.
   * Called after verification and on manual refresh.
   */
  static async syncUserData(userId, handle) {
    await CodeforcesRepository.updateSyncStatus(userId, "syncing");

    try {
      // 1. Re-fetch user info
      const [cfUsers, ratingHistory, submissions] = await Promise.all([
        cfGetUserInfo(handle),
        cfGetUserRating(handle),
        cfGetUserStatus(handle, 1, 10000),
      ]);

      const cfUser = cfUsers[0];

      // 2. Compute stats from submissions
      const stats = computeStats(submissions);
      const activityData = computeActivityData(submissions);

      // 3. Compute contest participation count from rating history
      stats.contestsParticipated = ratingHistory.length;
      if (ratingHistory.length > 0) {
        const ranks = ratingHistory.map((r) => r.rank).filter(Boolean);
        stats.bestRank = ranks.length ? Math.min(...ranks) : null;
        stats.worstRank = ranks.length ? Math.max(...ranks) : null;
      }

      // 4. Persist grouped submission documents
      const submissionDocs = submissions.map((sub) => ({
        user: userId,
        submissionId: sub.id,
        contestId: sub.contestId,
        creationTimeSeconds: sub.creationTimeSeconds,
        relativeTimeSeconds: sub.relativeTimeSeconds,
        problem: sub.problem,
        programmingLanguage: sub.programmingLanguage,
        verdict: sub.verdict,
        testset: sub.testset,
        passedTestCount: sub.passedTestCount,
        timeConsumedMillis: sub.timeConsumedMillis,
        memoryConsumedBytes: sub.memoryConsumedBytes,
        points: sub.points,
        author: sub.author
          ? {
              participantType: sub.author.participantType,
              ghost: sub.author.ghost,
              room: sub.author.room,
              startTimeSeconds: sub.author.startTimeSeconds,
            }
          : undefined,
      }));

      await CodeforcesRepository.bulkUpsertSubmissions(submissionDocs);

      // 5. Persist rating history
      const ratingDocs = ratingHistory.map((r) => ({
        user: userId,
        handle: handle.toLowerCase(),
        contestId: r.contestId,
        contestName: r.contestName,
        rank: r.rank,
        ratingUpdateTimeSeconds: r.ratingUpdateTimeSeconds,
        oldRating: r.oldRating,
        newRating: r.newRating,
        ratingChange: r.newRating - r.oldRating,
      }));

      await CodeforcesRepository.bulkUpsertRatingHistory(ratingDocs);

      // 6. Update full profile
      await CodeforcesRepository.upsertProfile(userId, {
        handle: cfUser.handle.toLowerCase(),
        email: cfUser.email,
        firstName: cfUser.firstName,
        lastName: cfUser.lastName,
        country: cfUser.country,
        city: cfUser.city,
        organization: cfUser.organization,
        contribution: cfUser.contribution || 0,
        rank: cfUser.rank || "unrated",
        rating: cfUser.rating || 0,
        maxRank: cfUser.maxRank || "unrated",
        maxRating: cfUser.maxRating || 0,
        lastOnlineTimeSeconds: cfUser.lastOnlineTimeSeconds,
        registrationTimeSeconds: cfUser.registrationTimeSeconds,
        friendOfCount: cfUser.friendOfCount || 0,
        avatar: cfUser.avatar || "",
        titlePhoto: cfUser.titlePhoto || "",
        stats: {
          ...stats,
          dailyActivity: activityData.dailyActivity,
          currentStreak: activityData.currentStreak,
          longestStreak: activityData.longestStreak,
        },
        syncStatus: "success",
        syncError: null,
        lastSyncedAt: new Date(),
      });

      return { message: "Sync complete." };
    } catch (err) {
      await CodeforcesRepository.updateSyncStatus(userId, "failed", err.message);
      throw err;
    }
  }

  /**
   * Get the full stored profile + rating history for a user.
   */
  static async getProfile(userId) {
    const profile = await CodeforcesRepository.findProfileByUserId(userId);
    if (!profile) {
      return { connected: false };
    }
    if (!profile.isVerified) {
      return {
        connected: false,
        pendingVerification: true,
        handle: profile.handle,
        verificationCode: profile.verificationCode,
      };
    }
    return { connected: true, profile };
  }

  /**
   * Get rating history for charting.
   */
  static async getRatingHistory(userId) {
    const profile = await CodeforcesRepository.findProfileByUserId(userId);
    if (!profile || !profile.isVerified) {
      return [];
    }
    const history = await CodeforcesRepository.getRatingHistory(userId);
    return history;
  }

  /**
   * Get recent submissions.
   */
  static async getRecentSubmissions(userId, count = 20) {
    const profile = await CodeforcesRepository.findProfileByUserId(userId);
    if (!profile || !profile.isVerified) {
      return [];
    }
    return CodeforcesRepository.getRecentSubmissions(userId, count);
  }

  /**
   * Manual data refresh trigger.
   */
  static async refreshData(userId) {
    const profile = await CodeforcesRepository.findProfileByUserId(userId);
    if (!profile || !profile.isVerified) {
      throw new ApiError(400, "Connect and verify your Codeforces account first.");
    }

    const lastSync = profile.lastSyncedAt;
    if (lastSync) {
      const minutesSince = (Date.now() - lastSync.getTime()) / 60_000;
      if (minutesSince < 5) {
        throw new ApiError(
          429,
          `Data was synced ${Math.round(minutesSince)} minute(s) ago. Please wait before refreshing.`
        );
      }
    }

    // Kick off async sync
    CodeforcesService.syncUserData(userId, profile.handle).catch((err) =>
      console.error("[CF Sync Error]", err.message)
    );

    return { message: "Sync started. Refresh in a few seconds." };
  }

  /**
   * Disconnect Codeforces account.
   */
  static async disconnect(userId) {
    await Promise.all([
      CodeforcesRepository.deleteProfileByUserId(userId),
      CodeforcesRepository.deleteSubmissionsByUserId(userId),
      CodeforcesRepository.deleteRatingHistoryByUserId(userId),
      CodeforcesRepository.clearUserCodeforcesHandle(userId),
    ]);
    return { message: "Codeforces account disconnected." };
  }

  /**
   * Get the dashboard summary widget data — lightweight.
   */
  static async getDashboardSummary(userId) {
    const profile = await CodeforcesRepository.findProfileByUserId(userId);
    if (!profile || !profile.isVerified) {
      return { connected: false };
    }

    return {
      connected: true,
      handle: profile.handle,
      rating: profile.rating,
      maxRating: profile.maxRating,
      rank: profile.rank,
      maxRank: profile.maxRank,
      totalSolved: profile.stats?.totalSolved || 0,
      contestsParticipated: profile.stats?.contestsParticipated || 0,
      currentStreak: profile.stats?.currentStreak || 0,
      longestStreak: profile.stats?.longestStreak || 0,
      lastSyncedAt: profile.lastSyncedAt,
      avatar: profile.avatar,
    };
  }
}

export default CodeforcesService;
