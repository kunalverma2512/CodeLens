import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import AuthService from "./service.js";
import { setAuthCookies, clearAuthCookies, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../../utils/tokenHelper.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

class AuthController {
  // ── Email Auth ───────────────────────────────────────────────────────────────

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
      // Store hashed refresh token for revocation support
      await AuthController.#persistRefreshToken(result.user.id, result.refreshToken);
      // Set HttpOnly cookies — no token in response body
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(200).json(ApiResponse.success(result.message, { user: result.user }));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      // Store hashed refresh token for revocation support
      await AuthController.#persistRefreshToken(result.user.id, result.refreshToken);
      // Set HttpOnly cookies — no token in response body
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(200).json(ApiResponse.success(result.message, { user: result.user }));
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

  // ── Session ──────────────────────────────────────────────────────────────────

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user (from cookie).
   * The frontend calls this on startup to hydrate the AuthContext.
   */
  static async getMe(req, res, next) {
    try {
      // req.user is already populated by authMiddleware
      const user = req.user;
      if (!user) {
        throw new ApiError(401, "Not authenticated");
      }
      res.status(200).json(ApiResponse.success("Authenticated", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
        profile: user.profile,
        handles: user.handles,
        oauth: {
          github: user.oauth?.github
            ? {
                id:         user.oauth.github.id,
                username:   user.oauth.github.username,
                profileUrl: user.oauth.github.profileUrl,
              }
            : undefined
        }
      }));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  /**
   * POST /api/auth/logout
   * Clears auth cookies and invalidates the refresh token server-side.
   * Protected by authMiddleware (best-effort — even if auth fails, cookies are cleared).
   */
  static async logout(req, res, next) {
    try {
      // Invalidate the stored refresh token hash so the token can't be reused
      // even if an attacker captured it from a cookie jar or network sniff.
      if (req.user?._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $unset: { "security.refreshTokenHash": "" }
        });
      }
      clearAuthCookies(res);
      res.status(200).json(ApiResponse.success("Logged out successfully"));
    } catch (error) {
      // Even if DB update fails, we must still clear the cookies — best-effort.
      clearAuthCookies(res);
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  /**
   * POST /api/auth/refresh
   * Validates the refresh token against the DB record, then rotates both tokens.
   */
  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, "No refresh token. Please log in again.");
      }

      const decoded = verifyRefreshToken(refreshToken);
      const userId = decoded.userId || decoded.id || decoded._id;

      // Fetch the user including the stored hash (select: false field)
      const user = await User.findById(userId).select("+security.refreshTokenHash");
      if (!user) {
        throw new ApiError(401, "User not found.");
      }

      // Validate the incoming token against our stored hash — this is the
      // revocation check. If the hashes don't match (e.g. after logout or
      // token theft detection), the session is invalid.
      const storedHash = user.security?.refreshTokenHash;
      if (!storedHash) {
        throw new ApiError(401, "Session has been revoked. Please log in again.");
      }
      const isValid = await bcrypt.compare(refreshToken, storedHash);
      if (!isValid) {
        // The token presented doesn't match — possible theft; clear everything.
        await User.findByIdAndUpdate(userId, { $unset: { "security.refreshTokenHash": "" } });
        clearAuthCookies(res);
        throw new ApiError(401, "Invalid session. Please log in again.");
      }

      // Issue rotated token pair
      const tokenPayload = { userId: user._id, email: user.email, role: user.role };
      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Persist new refresh token hash (rotation invalidates the old one)
      await AuthController.#persistRefreshToken(user._id, newRefreshToken);

      setAuthCookies(res, newAccessToken, newRefreshToken);
      res.status(200).json(ApiResponse.success("Token refreshed"));
    } catch (error) {
      clearAuthCookies(res);
      next(error instanceof ApiError ? error : new ApiError(401, "Session expired. Please log in again."));
    }
  }

  // ── GitHub OAuth ─────────────────────────────────────────────────────────────

  /**
   * GET /api/auth/github/start
   * Redirects the browser to GitHub's OAuth authorization page (login/signup flows).
   */
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

  /**
   * GET /api/auth/github/connect-init
   * Protected endpoint (requires cookie auth). Returns the GitHub OAuth URL as JSON.
   * The frontend then navigates to this URL — this avoids the Authorization header problem
   * with plain browser navigations.
   *
   * Flow:
   *   Frontend: GET /api/auth/github/connect-init  (axios, cookie sent automatically)
   *   Server:   verifies cookie → builds state JWT with userId → returns { url }
   *   Frontend: window.location.href = url
   *   GitHub → GET /api/auth/github/callback → connects account → redirects to /account-center
   */
  static async startGithubConnect(req, res, next) {
    try {
      const { redirectPath } = req.validatedQuery || req.query;
      const url = AuthService.getGithubConnectUrl({
        userId: req.user._id,
        redirectPath
      });
      return res.status(200).json(ApiResponse.success("GitHub connect URL generated", { url }));
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(500, error.message));
    }
  }

  /**
   * GET /api/auth/github/callback
   * GitHub redirects here after user authorizes the OAuth app.
   */
  static async githubCallback(req, res, next) {
    const fallbackBase = process.env.CLIENT_URL || "http://localhost:5173";

    try {
      const { code, state } = req.validatedQuery || req.query;
      const result = await AuthService.handleGithubCallback({ code, state });

      if (result.mode === "login") {
        // Store hashed refresh token for revocation support
        await AuthController.#persistRefreshToken(result.user.id, result.refreshToken);
        // Set HttpOnly auth cookies before redirecting the browser
        setAuthCookies(res, result.accessToken, result.refreshToken);
      }

      // Both modes redirect — connect redirects to account-center, login to callback page
      return res.redirect(result.redirectUrl);
    } catch (error) {
      // Build a safe error redirect back to the login page
      const fallbackErrorRedirect = new URL("/login", fallbackBase);
      fallbackErrorRedirect.searchParams.set(
        "githubAuthError",
        error?.message || "GitHub authentication failed"
      );
      return res.redirect(fallbackErrorRedirect.toString());
    }
  }

  // ── Private Helpers ──────────────────────────────────────────────────────────

  /**
   * Hashes the refresh token and stores it on the user document.
   * Low bcrypt cost (4) is intentional — tokens are already long random strings,
   * and we need this to be fast since it's called on every login.
   *
   * @param {string|ObjectId} userId
   * @param {string} refreshToken - The raw refresh token JWT
   */
  static async #persistRefreshToken(userId, refreshToken) {
    const hash = await bcrypt.hash(refreshToken, 4);
    await User.findByIdAndUpdate(userId, {
      $set: { "security.refreshTokenHash": hash }
    });
  }
}

export default AuthController;
