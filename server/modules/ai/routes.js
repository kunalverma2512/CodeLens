import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import AiController from "./controller.js";
import { apexChatLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

// All AI routes require authentication
router.use(authMiddleware);

// ── Existing routes (insight + dashboard summary) ──────────────────────────────

/**
 * GET /api/ai/insight/stream
 * Returns a Server-Sent Events stream of personalized AI growth insight.
 */
router.get("/insight/stream", AiController.streamInsight);

/**
 * GET /api/ai/dashboard-summary
 * Fetches the cached dashboard summary or generates a new one.
 */
router.get("/dashboard-summary", AiController.getDashboardSummary);

// ── APEX Conversation routes ───────────────────────────────────────────────────
// Apply the APEX chat rate limiter to all /apex/* routes.
// The limiter's internal `skip` function ensures only POST /:id/message is counted.
router.use("/apex", apexChatLimiter);

/**
 * POST /api/ai/apex/conversations
 * Creates a new APEX conversation and compiles fresh user context.
 * Body: none required.
 */
router.post("/apex/conversations", AiController.createConversation);

/**
 * GET /api/ai/apex/conversations
 * Lists all conversations for the authenticated user (sidebar data).
 * Returns: [{ _id, title, pinned, updatedAt, lastMessagePreview }]
 */
router.get("/apex/conversations", AiController.listConversations);

/**
 * GET /api/ai/apex/conversations/:id
 * Loads the full message history of a specific conversation.
 * Returns 403 if the user doesn't own this conversation.
 */
router.get("/apex/conversations/:id", AiController.loadConversation);

/**
 * POST /api/ai/apex/conversations/:id/message
 * Sends a user message and streams APEX's reply via SSE.
 * Body: { message: string }
 * Response: text/event-stream with { content } chunks, ending with { done: true }
 */
router.post("/apex/conversations/:id/message", AiController.sendMessage);

/**
 * DELETE /api/ai/apex/conversations/:id
 * Soft-deletes a conversation (sets isDeleted: true).
 * Returns 403 if the user doesn't own this conversation.
 */
router.delete("/apex/conversations/:id", AiController.deleteConversation);

export default router;

