import GitHubService from "./service.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

class GitHubController {
  static async getDashboard(req, res, next) {
    try {
      const data = await GitHubService.getDashboard(req.user._id);
      res.status(200).json(ApiResponse.success("GitHub dashboard loaded", data));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async getProfile(req, res, next) {
    try {
      const data = await GitHubService.getProfile(req.user._id);
      res.status(200).json(ApiResponse.success("GitHub profile loaded", data));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async getRepositories(req, res, next) {
    try {
      const data = await GitHubService.getRepositories(req.user._id);
      res.status(200).json(ApiResponse.success("Repositories loaded", data));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async getContributions(req, res, next) {
    try {
      const data = await GitHubService.getContributions(req.user._id);
      res.status(200).json(ApiResponse.success("Contributions loaded", data));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }

  static async getActivity(req, res, next) {
    try {
      const data = await GitHubService.getActivity(req.user._id);
      res.status(200).json(ApiResponse.success("Activity loaded", data));
    } catch (err) {
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }
}

export default GitHubController;
