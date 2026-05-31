import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { githubSyncLimiter } from "../../middlewares/rateLimiter.js";
import GitHubController from "./controller.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/github/dashboard
 * Returns all GitHub data in one shot (cached).
 */
router.get("/dashboard", GitHubController.getDashboard);

/**
 * POST /api/github/sync
 * Manually force a sync with GitHub API, updates the cache. Rate limited to 1 request per 15 mins.
 */
router.post("/sync", githubSyncLimiter, GitHubController.syncDashboard);

/** GET /api/github/profile */
router.get("/profile", GitHubController.getProfile);

/** GET /api/github/repos */
router.get("/repos", GitHubController.getRepositories);

/** GET /api/github/contributions */
router.get("/contributions", GitHubController.getContributions);

/** GET /api/github/activity */
router.get("/activity", GitHubController.getActivity);

export default router;
