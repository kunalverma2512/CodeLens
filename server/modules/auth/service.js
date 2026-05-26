
import bcrypt from "bcryptjs";
import axios from "axios";
import jwt from "jsonwebtoken";

import ApiError from "../../utils/ApiError.js";
import AuthRepository from "./repository.js";

import { generateAccessToken } from "../../utils/tokenHelper.js";
import { generateOTP } from "../../utils/otpHelper.js";

import {
  sendVerificationOTP,
  sendPasswordResetOTP,
} from "../../utils/emailService.js";

// =========================
// CONSTANTS
// =========================
const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCK_MINUTES = 15;

// simple in-memory rate limiter (DEV LEVEL)
const otpRequestMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min

// =========================
// GITHUB CONFIG
// =========================
const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_ACCESS_TOKEN_URL =
  "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const GITHUB_SCOPE = "read:user user:email";

// =========================
// UTILITY
// =========================
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  profile: user.profile,
  handles: user.handles,
});

// =========================
// SERVICE CLASS
// =========================
class AuthService {
  // =========================
  // REGISTER
  // =========================
  static async register({ name, email, password }) {
    // RATE LIMIT
    const regKey = `${email}-register`;
    const regLast = otpRequestMap.get(regKey);

    if (regLast && Date.now() - regLast < RATE_LIMIT_WINDOW) {
      throw new ApiError(429, "Please wait before trying again");
    }

    otpRequestMap.set(regKey, Date.now());

    const existingUser =
      await AuthRepository.findUserByEmailWithoutPassword(email);

    // VERIFIED USER EXISTS
    if (existingUser && existingUser.isVerified) {
      throw new ApiError(409, "User already exists with this email");
    }

    // UNVERIFIED USER EXISTS → RESEND OTP
    if (existingUser && !existingUser.isVerified) {
      const plainOtp = generateOTP();
      const hashedOtp = await bcrypt.hash(plainOtp, 6);

      await AuthRepository.createOtp({
        email,
        otp: hashedOtp,
        purpose: "signup",
      });

      await sendVerificationOTP(email, plainOtp);

      return {
        message: "Verification OTP resent successfully",
        user: sanitizeUser(existingUser),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 6);

    await AuthRepository.createOtp({
      email,
      otp: hashedOtp,
      purpose: "signup",
    });

    await sendVerificationOTP(email, plainOtp);

    return {
      message:
        "Registration successful. Please check your email for OTP verification.",
      user: sanitizeUser(user),
    };
  }

  // =========================
  // VERIFY OTP
  // =========================
  static async verifyOtp({ email, otp }) {
    const otpRecord = await AuthRepository.findOtp(email, "signup");

    if (!otpRecord) {
      throw new ApiError(400, "OTP expired or not found");
    }

    if (otpRecord.lockUntil && otpRecord.lockUntil > new Date()) {
      throw new ApiError(
        429,
        `Too many failed attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
      );
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValidOtp) {
      const updated = await AuthRepository.incrementOtpFailure(
        email,
        "signup"
      );

      const attempts = updated?.failedAttempts ?? 1;

      if (attempts >= MAX_OTP_ATTEMPTS) {
        await AuthRepository.lockOtp(
          email,
          "signup",
          OTP_LOCK_MINUTES
        );

        throw new ApiError(
          429,
          `Too many failed attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
        );
      }

      const remaining = MAX_OTP_ATTEMPTS - attempts;

      throw new ApiError(
        400,
        `Invalid OTP. ${remaining} attempts left`
      );
    }

    await AuthRepository.resetOtp(email, "signup");
    await AuthRepository.deleteOtp(email, "signup");
    await AuthRepository.updateUserVerification(email);

    const user = await AuthRepository.findUserByEmailWithoutPassword(email);

    const token = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Email verified successfully",
      token,
      user: sanitizeUser(user),
    };
  }

  // =========================
  // LOGIN
  // =========================
  static async login({ email, password }) {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email first");
    }

    const token = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    user.activity.lastActive = new Date();
    await user.save();

    return {
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    };
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  static async forgotPassword({ email }) {
    const key = `${email}-forgot-password`;
    const last = otpRequestMap.get(key);

    if (last && Date.now() - last < RATE_LIMIT_WINDOW) {
      throw new ApiError(429, "Please wait before requesting OTP");
    }

    otpRequestMap.set(key, Date.now());

    const user =
      await AuthRepository.findUserByEmailWithoutPassword(email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 6);

    await AuthRepository.createOtp({
      email,
      otp: hashedOtp,
      purpose: "forgot-password",
    });

    await sendPasswordResetOTP(email, plainOtp);

    return {
      message: "Password reset OTP sent to your email",
    };
  }

  // =========================
  // RESET PASSWORD
  // =========================
  static async resetPassword({ email, otp, newPassword }) {
    const otpRecord = await AuthRepository.findOtp(
      email,
      "forgot-password"
    );

    if (!otpRecord) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    if (otpRecord.lockUntil && otpRecord.lockUntil > new Date()) {
      throw new ApiError(
        429,
        `Too many failed attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
      );
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValidOtp) {
      const updated = await AuthRepository.incrementOtpFailure(
        email,
        "forgot-password"
      );

      const attempts = updated?.failedAttempts ?? 1;

      if (attempts >= MAX_OTP_ATTEMPTS) {
        await AuthRepository.lockOtp(
          email,
          "forgot-password",
          OTP_LOCK_MINUTES
        );

        throw new ApiError(
          429,
          `Too many failed attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
        );
      }

      throw new ApiError(400, "Invalid or expired OTP");
    }

    await AuthRepository.resetOtp(email, "forgot-password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await AuthRepository.updateUserPassword(email, hashedPassword);

    await AuthRepository.deleteOtp(email, "forgot-password");

    return {
      message: "Password reset successful",
    };
  }

  // =========================
  // RESEND OTP
  // =========================
  static async resendOtp({ email, purpose }) {
    const key = `${email}-${purpose}`;
    const last = otpRequestMap.get(key);

    if (last && Date.now() - last < RATE_LIMIT_WINDOW) {
      throw new ApiError(429, "Please wait before requesting another OTP");
    }

    otpRequestMap.set(key, Date.now());

    const user =
      await AuthRepository.findUserByEmailWithoutPassword(email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (purpose === "signup" && user.isVerified) {
      throw new ApiError(400, "Already verified");
    }

    const existingOtp = await AuthRepository.findOtp(email, purpose);

    if (
      existingOtp?.lockUntil &&
      existingOtp.lockUntil > new Date()
    ) {
      throw new ApiError(
        429,
        `Too many failed attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
      );
    }

    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 6);

    await AuthRepository.createOtp({
      email,
      otp: hashedOtp,
      purpose,
    });

    if (purpose === "signup") {
      await sendVerificationOTP(email, plainOtp);
    } else {
      await sendPasswordResetOTP(email, plainOtp);
    }

    return {
      message: "OTP resent successfully",
    };
  }

  // =========================
  // GITHUB AUTH URL
  // =========================
  static getGithubAuthorizationUrl({
    mode = "login",
    userId = null,
    redirectPath,
  }) {
    const safeMode = mode === "connect" ? "connect" : "login";

    const stateSecret =
      process.env.GITHUB_STATE_SECRET || process.env.JWT_SECRET;

    const state = jwt.sign(
      { mode: safeMode, userId, redirectPath },
      stateSecret,
      { expiresIn: "10m" }
    );

    const query = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: GITHUB_SCOPE,
      state,
    });

    return `${GITHUB_OAUTH_URL}?${query}`;
  }

  // =========================
  // GITHUB CALLBACK
  // =========================
  static async handleGithubCallback({ code, state }) {
    let decoded;

    try {
      decoded = jwt.verify(
        state,
        process.env.GITHUB_STATE_SECRET || process.env.JWT_SECRET
      );
    } catch {
      throw new ApiError(400, "Invalid or expired GitHub state");
    }

    const tokenRes = await axios.post(
      GITHUB_ACCESS_TOKEN_URL,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    const profileRes = await axios.get(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubProfile = profileRes.data;

    // CONNECT FLOW
    if (decoded.mode === "connect") {
      const user = await AuthRepository.findUserById(decoded.userId);

      if (!user) {
        throw new ApiError(404, "User not found for GitHub connect");
      }

      await AuthRepository.updateUserGithubIdentity(user._id, {
        id: githubProfile.id,
        username: githubProfile.login,
        profileUrl: githubProfile.html_url,
        avatarUrl: githubProfile.avatar_url,
        accessToken,
      });

      const appToken = generateAccessToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      return {
        message: "GitHub account connected successfully",
        token: appToken,
        user: sanitizeUser(user),
      };
    }

    // LOGIN FLOW
    const user = await AuthRepository.findUserByGithubId(
      githubProfile.id
    );

    if (!user) {
      throw new ApiError(
        401,
        "GitHub account not linked. Please sign up first or connect account."
      );
    }

    const appToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "GitHub login successful",
      token: appToken,
      user: sanitizeUser(user),
    };
  }
}

export default AuthService;

