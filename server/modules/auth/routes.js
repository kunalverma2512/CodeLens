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

import { otpLimiter } from "../../middlewares/rateLimiter.js";

import rateLimit from "express-rate-limit";

const router = Router();

// =========================
// GitHub Connect Rate Limiter
// =========================
const githubConnectRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many GitHub connect attempts. Please try again shortly."
  }
});

// =========================
// AUTH ROUTES
// =========================

// Register
router.post(
  "/register",
  otpLimiter,
  validate(registerSchema),
  AuthController.register
);

// Verify OTP (Protected with rate limiter)
router.post(
  "/verify-otp",
  otpLimiter,
  validate(verifyOtpSchema),
  AuthController.verifyOtp
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  AuthController.login
);

// Forgot Password
router.post(
  "/forgot-password",
  otpLimiter,
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

// Resend OTP
router.post(
  "/resend-otp",
  otpLimiter,
  validate(resendOtpSchema),
  AuthController.resendOtp
);

// =========================
// GITHUB AUTH
// =========================

// Start GitHub OAuth
router.get(
  "/github/start",
  validateQuery(githubStartSchema),
  AuthController.startGithubAuth
);

// Connect GitHub Account
router.get(
  "/github/connect",
  githubConnectRateLimit,
  authMiddleware,
  validateQuery(githubStartSchema),
  AuthController.startGithubConnect
);

// GitHub Callback
router.get(
  "/github/callback",
  validateQuery(githubCallbackSchema),
  AuthController.githubCallback
);

export default router;