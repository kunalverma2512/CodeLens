import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 10,

  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});