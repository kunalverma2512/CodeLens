import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import ContestService from "./service.js";

class ContestController {
  static async getUpcomingCodeforcesContests(req, res, next) {
    try {
      const contests = await ContestService.getUpcomingContests();
      res
        .status(200)
        .json(ApiResponse.success("Upcoming Codeforces contests fetched.", contests));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async getReminderIds(req, res, next) {
    try {
      const contestIds = await ContestService.getUserReminderIds(req.user._id);
      res.status(200).json(ApiResponse.success("Reminders fetched.", contestIds));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async getActiveReminders(req, res, next) {
    try {
      const reminders = await ContestService.getActiveReminders(req.user._id);
      res.status(200).json(ApiResponse.success("Active reminders fetched.", reminders));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async addReminder(req, res, next) {
    try {
      const result = await ContestService.addReminder(req.user._id, req.body.contestId);
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async removeReminder(req, res, next) {
    try {
      // req.params.contestId is already a validated, coerced number here —
      // see validateParams(contestIdParamSchema) in routes.js.
      const result = await ContestService.removeReminder(req.user._id, req.params.contestId);
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async markNotified(req, res, next) {
    try {
      const result = await ContestService.markReminderNotified(req.user._id, req.params.contestId);
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }
}

export default ContestController;
