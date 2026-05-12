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
import { createRateLimiter } from "../../middlewares/rateLimit.js";

const router = Router();
const githubConnectRateLimit = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many GitHub connect attempts. Please try again shortly."
});

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);
router.post("/resend-otp", validate(resendOtpSchema), AuthController.resendOtp);
router.get("/github/start", validateQuery(githubStartSchema), AuthController.startGithubAuth);
router.get(
  "/github/connect",
  githubConnectRateLimit,
  authMiddleware,
  validateQuery(githubStartSchema),
  AuthController.startGithubConnect
);
router.get("/github/callback", validateQuery(githubCallbackSchema), AuthController.githubCallback);

export default router;
