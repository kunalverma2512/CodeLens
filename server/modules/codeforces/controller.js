import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import CodeforcesService from "./service.js";

class CodeforcesController {
  /**
   * POST /api/codeforces/connect
   * Body: { handle }
   * Initiates the surname-verification flow.
   */
  static async initiateConnection(req, res, next) {
    try {
      const result = await CodeforcesService.initiateConnection(
        req.user._id,
        req.body.handle
      );
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * POST /api/codeforces/verify
   * Body: { handle }
   * Checks CF surname matches verification code.
   */
  static async verifyConnection(req, res, next) {
    try {
      const result = await CodeforcesService.verifyConnection(
        req.user._id,
        req.body.handle
      );
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * GET /api/codeforces/profile
   * Returns the full stored CF profile.
   */
  static async getProfile(req, res, next) {
    try {
      const result = await CodeforcesService.getProfile(req.user._id);
      res.status(200).json(ApiResponse.success("Codeforces profile fetched.", result));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * GET /api/codeforces/rating-history
   * Returns sorted rating history for charting.
   */
  static async getRatingHistory(req, res, next) {
    try {
      const history = await CodeforcesService.getRatingHistory(req.user._id);
      res.status(200).json(ApiResponse.success("Rating history fetched.", history));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * GET /api/codeforces/submissions?count=20
   * Returns recent submissions.
   */
  static async getRecentSubmissions(req, res, next) {
    try {
      const count = Math.min(parseInt(req.query.count, 10) || 20, 100);
      const submissions = await CodeforcesService.getRecentSubmissions(
        req.user._id,
        count
      );
      res.status(200).json(ApiResponse.success("Recent submissions fetched.", submissions));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * POST /api/codeforces/refresh
   * Triggers a manual data sync.
   */
  static async refreshData(req, res, next) {
    try {
      const result = await CodeforcesService.refreshData(req.user._id);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * DELETE /api/codeforces/disconnect
   * Removes all CF data for the user.
   */
  static async disconnect(req, res, next) {
    try {
      const result = await CodeforcesService.disconnect(req.user._id);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  /**
   * GET /api/codeforces/dashboard
   * Lightweight summary for dashboard widget.
   */
  static async getDashboardSummary(req, res, next) {
    try {
      const summary = await CodeforcesService.getDashboardSummary(req.user._id);
      res.status(200).json(ApiResponse.success("Dashboard summary fetched.", summary));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }
}

export default CodeforcesController;
