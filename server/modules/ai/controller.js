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
}

export default AiController;
