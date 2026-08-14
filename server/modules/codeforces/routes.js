import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { csrfProtection } from "../../middlewares/csrfProtection.js";
import CodeforcesController from "./controller.js";
import {
  validate,
  initiateConnectionSchema,
  verifyConnectionSchema,
} from "./validation.js";

const router = Router();

// All routes require authenticated user
router.use(authMiddleware);
router.use(csrfProtection);

// ── Connection Flow ──────────────────────────────────────────────────────────
// Step 1: supply handle → get back verification code to set as CF surname
router.post("/connect", validate(initiateConnectionSchema), CodeforcesController.initiateConnection);

// Step 2: confirm surname was updated → CF account linked
router.post("/verify", validate(verifyConnectionSchema), CodeforcesController.verifyConnection);

// Disconnect CF account
router.delete("/disconnect", CodeforcesController.disconnect);

// ── Data Endpoints ───────────────────────────────────────────────────────────
// Full profile (includes stats, heatmap data)
router.get("/profile", CodeforcesController.getProfile);

// Rating history for graph
router.get("/rating-history", CodeforcesController.getRatingHistory);

// Recent submissions list  (?count=N)
router.get("/submissions", CodeforcesController.getRecentSubmissions);

// Lightweight summary for dashboard widget
router.get("/dashboard", CodeforcesController.getDashboardSummary);

// Manual sync trigger
router.post("/refresh", CodeforcesController.refreshData);

export default router;
