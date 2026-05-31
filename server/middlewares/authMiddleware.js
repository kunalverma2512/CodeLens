import { verifyToken, verifyRefreshToken, generateAccessToken, setAccessTokenCookie } from "../utils/tokenHelper.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/**
 * Auth Middleware
 *
 * Token resolution order:
 *   1. req.cookies.accessToken   (HttpOnly cookie — primary, works with browser navigations)
 *   2. Authorization: Bearer ... (fallback for API clients / testing)
 *
 * If the access token is expired BUT a valid refresh token cookie exists,
 * we transparently issue a new access token cookie (silent refresh).
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;
    let tokenSource = null;

    // ── 1. Try HttpOnly cookie first ──────────────────────────────────────
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      tokenSource = "cookie";
    }
    // ── 2. Fallback: Authorization header (for API clients / Postman) ─────
    else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1] || null;
        tokenSource = "header";
      }
    }

    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.");
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      // ── Silent token refresh via refresh cookie ───────────────────────
      if (err.name === "TokenExpiredError" && tokenSource === "cookie" && req.cookies?.refreshToken) {
        try {
          const refreshDecoded = verifyRefreshToken(req.cookies.refreshToken);
          const userId = refreshDecoded.userId || refreshDecoded.id || refreshDecoded._id;
          const newAccessToken = generateAccessToken({
            userId,
            email: refreshDecoded.email,
            role: refreshDecoded.role
          });
          // Set only the new access token cookie — refresh token stays unchanged.
          // Cookie options are centralised in setAccessTokenCookie (tokenHelper.js).
          setAccessTokenCookie(res, newAccessToken);
          decoded = { userId, email: refreshDecoded.email, role: refreshDecoded.role };
        } catch {
          throw new ApiError(401, "Session expired. Please log in again.");
        }
      } else {
        throw new ApiError(401, "Invalid or expired token.");
      }
    }

    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      throw new ApiError(401, "Invalid token payload.");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found or account deleted.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};

export default authMiddleware;
