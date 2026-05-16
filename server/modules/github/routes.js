import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import GitHubController from "./controller.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/github/dashboard
 * Returns all GitHub data in one shot — profile, repos, languages, contributions, events.
 */
router.get("/dashboard", GitHubController.getDashboard);

/** GET /api/github/profile */
router.get("/profile", GitHubController.getProfile);

/** GET /api/github/repos */
router.get("/repos", GitHubController.getRepositories);

/** GET /api/github/contributions */
router.get("/contributions", GitHubController.getContributions);

/** GET /api/github/activity */
router.get("/activity", GitHubController.getActivity);

export default router;
