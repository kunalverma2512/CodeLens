import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import AuthService from "./service.js";

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(ApiResponse.success(result.message, result.user));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async verifyOtp(req, res, next) {
    try {
      const result = await AuthService.verifyOtp(req.body);
      res.status(200).json(ApiResponse.success(result.message, {
        token: result.token,
        user: result.user
      }));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(ApiResponse.success(result.message, {
        token: result.token,
        user: result.user
      }));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const result = await AuthService.forgotPassword(req.body);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const result = await AuthService.resetPassword(req.body);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async resendOtp(req, res, next) {
    try {
      const result = await AuthService.resendOtp(req.body);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async startGithubAuth(req, res, next) {
    try {
      const { redirectPath } = req.validatedQuery || req.query;
      const authUrl = AuthService.getGithubAuthorizationUrl({
        mode: "login",
        redirectPath
      });

      return res.redirect(authUrl);
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async startGithubConnect(req, res, next) {
    try {
      const { redirectPath } = req.validatedQuery || req.query;
      const authUrl = AuthService.getGithubAuthorizationUrl({
        mode: "connect",
        userId: req.user?._id,
        redirectPath
      });

      return res.redirect(authUrl);
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async githubCallback(req, res, next) {
    try {
      const { code, state } = req.validatedQuery || req.query;
      const result = await AuthService.handleGithubCallback({ code, state });

      return res.redirect(result.redirectUrl);
    } catch (error) {
      const fallbackBase = process.env.CLIENT_URL || "http://localhost:5173";
      const fallbackErrorRedirect = new URL("/login", fallbackBase);
      fallbackErrorRedirect.searchParams.set(
        "githubAuthError",
        error?.message || "GitHub authentication failed"
      );

      return res.redirect(fallbackErrorRedirect.toString());
    }
  }
}

export default AuthController;
