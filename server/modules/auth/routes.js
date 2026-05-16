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
