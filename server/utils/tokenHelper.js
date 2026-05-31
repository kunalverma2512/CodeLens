import jwt from "jsonwebtoken";
import "dotenv/config";

// ── Token Generation ─────────────────────────────────────────────────────────

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
  });
};

export const generateRefreshToken = (payload) => {
  // JWT_REFRESH_SECRET is a required env var — no fallback to JWT_SECRET.
  // Using the same key for both tokens would allow a compromised access token
  // to be used to forge a 30-day refresh token.
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d"
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// ── Cookie Helpers ────────────────────────────────────────────────────────────

const isProd = process.env.NODE_ENV === "production";

// Shared base options — single source of truth for all auth cookies.
const cookieBaseOptions = {
  httpOnly: true,
  secure: isProd,   // HTTPS-only in production
  sameSite: "Lax",  // Lax in all envs; change to Strict if no cross-site top-level GET flows
  path: "/",
};

/**
 * Sets both access + refresh tokens as HttpOnly cookies on the response.
 *
 * Why HttpOnly?
 *  - XSS cannot read them (unlike localStorage)
 *  - Automatically sent with every request including browser navigations
 *  - This is what GitHub, Google, Stripe all do
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  // Access token — short lived (15 min)
  res.cookie("accessToken", accessToken, {
    ...cookieBaseOptions,
    maxAge: 15 * 60 * 1000,           // 15 minutes in ms
  });

  // Refresh token — long lived (30 days)
  res.cookie("refreshToken", refreshToken, {
    ...cookieBaseOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });
};

/**
 * Sets only the access token cookie.
 * Used during silent refresh (middleware) where only the access token is rotated.
 */
export const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieBaseOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });
};

/**
 * Clears both auth cookies (used on logout).
 */
export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieBaseOptions);
  res.clearCookie("refreshToken", cookieBaseOptions);
};
