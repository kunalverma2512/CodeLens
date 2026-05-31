import AiService from "./service.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

class AiController {
  /**
   * GET /api/ai/insight/stream
   * Streams a personalized AI growth insight using SSE.
   */
  static async streamInsight(req, res, next) {
    try {
      await AiService.streamInsight(req.user._id, res);
    } catch (err) {
      // If headers already sent (SSE started), we can't send JSON error
      if (res.headersSent) {
        console.error("[AI Controller] Error after headers sent:", err.message);
        return;
      }
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * GET /api/ai/dashboard-summary
   * Fetches the cached dashboard summary or generates a new one.
   */
  static async getDashboardSummary(req, res, next) {
    try {
      const summary = await AiService.getDashboardSummary(req.user._id);
      res.json(new ApiResponse(200, "Dashboard summary retrieved successfully.", { summary }));
    } catch (err) {
      next(err);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // APEX CHAT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * POST /api/ai/apex/conversations
   * Creates a new APEX conversation. Compiles fresh user context on creation.
   */
  static async createConversation(req, res, next) {
    try {
      const conversation = await AiService.createConversation(req.user._id);
      res.status(201).json(
        new ApiResponse(201, "Conversation created successfully.", { conversation })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/ai/apex/conversations
   * Returns all conversations for the authenticated user (sidebar data).
   */
  static async listConversations(req, res, next) {
    try {
      const conversations = await AiService.listConversations(req.user._id);
      res.json(
        new ApiResponse(200, "Conversations retrieved successfully.", { conversations })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/ai/apex/conversations/:id
   * Loads a specific conversation's full message history.
   * Returns 403 if the authenticated user doesn't own this conversation.
   */
  static async loadConversation(req, res, next) {
    try {
      const conversation = await AiService.loadConversation(
        req.params.id,
        req.user._id
      );
      res.json(
        new ApiResponse(200, "Conversation loaded successfully.", { conversation })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/ai/apex/conversations/:id/message
   * Sends a user message and streams APEX's response via SSE.
   * Returns 400 if message body is missing or empty.
   */
  static async sendMessage(req, res, next) {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return next(new ApiError(400, "Message body is required and must be a non-empty string."));
      }

      if (message.trim().length > 4000) {
        return next(new ApiError(400, "Message is too long. Please keep it under 4000 characters."));
      }

      // SSE streaming — AiService handles setting headers and ending the response
      await AiService.sendMessage(
        req.params.id,
        req.user._id,
        message.trim(),
        res
      );
    } catch (err) {
      // If SSE headers already sent, we cannot send a JSON error response
      if (res.headersSent) {
        console.error("[APEX Controller] Error after SSE headers sent:", err.message);
        return;
      }
      next(err);
    }
  }

  /**
   * DELETE /api/ai/apex/conversations/:id
   * Soft-deletes a conversation.
   * Returns 403 if the authenticated user doesn't own this conversation.
   */
  static async deleteConversation(req, res, next) {
    try {
      await AiService.deleteConversation(req.params.id, req.user._id);
      res.json(
        new ApiResponse(200, "Conversation deleted successfully.", { deleted: true })
      );
    } catch (err) {
      next(err);
    }
  }
}

export default AiController;

