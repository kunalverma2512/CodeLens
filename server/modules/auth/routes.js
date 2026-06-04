import { Router } from "express";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOtpSchema,
  githubStartSchema,
  githubCallbackSchema,
  validate,
  validateQuery
} from "./validation.js";
import AuthController from "./controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiters
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." }
});

const githubConnectRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many GitHub connect attempts. Please try again shortly." }
});

// ── Email Auth Routes ─────────────────────────────────────────────────────────
router.post("/register",         authRateLimit, validate(registerSchema),       AuthController.register);
router.post("/verify-otp",       authRateLimit, validate(verifyOtpSchema),      AuthController.verifyOtp);
router.post("/login",            authRateLimit, validate(loginSchema),           AuthController.login);
router.post("/forgot-password",  authRateLimit, validate(forgotPasswordSchema),  AuthController.forgotPassword);
router.post("/reset-password",   authRateLimit, validate(resetPasswordSchema),   AuthController.resetPassword);
router.post("/resend-otp",       authRateLimit, validate(resendOtpSchema),       AuthController.resendOtp);

// ── Session Routes ────────────────────────────────────────────────────────────
/**
 * GET /api/auth/me
 * Returns current user from cookie. Frontend calls this on app startup.
 */
router.get("/me", authMiddleware, AuthController.getMe);

/**
 * POST /api/auth/logout
 * Clears auth cookies and revokes the stored refresh token.
 * authMiddleware populates req.user for DB-side revocation.
 * Cookies are cleared even if auth fails (best-effort).
 */
router.post("/logout", authMiddleware, AuthController.logout);

/**
 * POST /api/auth/refresh
 * Issues new access token from refresh token cookie.
 */
router.post("/refresh", AuthController.refresh);

// ── GitHub OAuth Routes ───────────────────────────────────────────────────────

/**
 * GET /api/auth/github/start
 * Initiates GitHub OAuth for login/signup. Browser navigates here directly.
 * Optional query: ?redirectPath=/some-path
 */
router.get("/github/start", validateQuery(githubStartSchema), AuthController.startGithubAuth);

/**
 * GET /api/auth/github/connect-init
 * Protected (cookie). Returns { url } for GitHub connect OAuth.
 * Frontend calls this via axios (cookie auto-sent), gets URL, then navigates.
 * This is the fix for the "Access denied" bug — browser navigations don't send
 * Authorization headers, so we must do the auth check inside an API call.
 */
router.get(
  "/github/connect-init",
  githubConnectRateLimit,
  authMiddleware,
  validateQuery(githubStartSchema),
  AuthController.startGithubConnect
);

/**
 * GET /api/auth/github/callback
 * GitHub redirects here after user authorizes. Sets cookies and redirects to frontend.
 */
router.get("/github/callback", validateQuery(githubCallbackSchema), AuthController.githubCallback);

export default router;
