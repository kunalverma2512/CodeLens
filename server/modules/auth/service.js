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
} from "../../utils/resendEmailService.js";

// =========================
// CONSTANTS
// =========================
const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCK_MINUTES = 15;

const otpRequestMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;

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
    const regKey = `${email}-register`;
    const regLast = otpRequestMap.get(regKey);

    if (regLast && Date.now() - regLast < RATE_LIMIT_WINDOW) {
      throw new ApiError(429, "Please wait before trying again");
    }

    otpRequestMap.set(regKey, Date.now());

    const existingUser =
      await AuthRepository.findUserByEmailWithoutPassword(email);

    if (existingUser && existingUser.isVerified) {
      throw new ApiError(409, "User already exists with this email");
    }
    if (existingUser && !existingUser.isVerified) {
  const existingOtp = await AuthRepository.findOtp(email, "signup");

  if (existingOtp?.lockUntil && existingOtp.lockUntil > new Date()) {
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
      message: "Registration successful",
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
        `Too many attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
      );
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
      const updated = await AuthRepository.incrementOtpFailure(
        email,
        "signup"
      );

      const attempts = updated?.failedAttempts || 1;
      const remaining = MAX_OTP_ATTEMPTS - attempts;

      if (attempts >= MAX_OTP_ATTEMPTS) {
        throw new ApiError(
          429,
          `Too many failed attempts. Try again after ${OTP_LOCK_MINUTES} minutes`
        );
      }

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

    if (!user) throw new ApiError(401, "Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new ApiError(401, "Invalid credentials");

    if (!user.isVerified) throw new ApiError(403, "Verify email first");

    const token = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

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
    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 6);

    await AuthRepository.createOtp({
      email,
      otp: hashedOtp,
      purpose: "forgot-password",
    });

    await sendPasswordResetOTP(email, plainOtp);

    return {
      message: "Password reset OTP sent",
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

    if (!otpRecord) throw new ApiError(400, "Invalid OTP");

    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) throw new ApiError(400, "Invalid OTP");

    await AuthRepository.resetOtp(email, "forgot-password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await AuthRepository.updateUserPassword(
      email,
      hashedPassword
    );

    await AuthRepository.deleteOtp(
      email,
      "forgot-password"
    );

    return {
      message: "Password reset successful",
    };
  }

  // =========================
  // RESEND OTP
  // =========================
  static async resendOtp({ email, purpose }) {
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
    const state = jwt.sign(
      { mode, userId, redirectPath },
      process.env.GITHUB_STATE_SECRET ||
        process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const query = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: GITHUB_SCOPE,
      state,
    });

    return `${GITHUB_OAUTH_URL}?${query.toString()}`;
  }

  // =========================
  // GITHUB CALLBACK
  // =========================
  static async handleGithubCallback({ code, state }) {
    let decoded;

    try {
      decoded = jwt.verify(
        state,
        process.env.GITHUB_STATE_SECRET ||
          process.env.JWT_SECRET
      );
    } catch {
      throw new ApiError(400, "Invalid GitHub state");
    }

    const tokenRes = await axios.post(
      GITHUB_ACCESS_TOKEN_URL,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const profileRes = await axios.get(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubProfile = profileRes.data;

    // =========================
    // FIND OR CREATE USER
    // =========================
    let user = await AuthRepository.findUserByGithubId(
      githubProfile.id
    );

    if (!user) {
      let email = githubProfile.email;

      // Fetch hidden GitHub email
      if (!email) {
        const emailsRes = await axios.get(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const primaryEmail = emailsRes.data.find(
          (e) => e.primary
        );

        email = primaryEmail?.email;
      }

      if (!email) {
        throw new ApiError(
          400,
          "GitHub email not available"
        );
      }

      // Check existing email user
      user =
        await AuthRepository.findUserByEmailWithoutPassword(
          email
        );

      // Create new user
      if (!user) {
        user = await AuthRepository.createUser({
          name:
            githubProfile.name || githubProfile.login,
          email,
          password: "",
          isVerified: true,
          githubId: githubProfile.id,
          profile: {
            avatar: githubProfile.avatar_url,
          },
        });
      }
    }

    // =========================
    // GENERATE TOKEN
    // =========================
    const appToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // =========================
    // FIXED REDIRECT
    // =========================
    const basePath =
      decoded?.redirectPath ||
      `${process.env.CLIENT_URL}/login?authStatus=success`;

    const separator = basePath.includes("#")
      ? "&"
      : "#";

    return {
      redirectUrl: `${basePath}${separator}token=${encodeURIComponent(
        appToken
      )}`,
    };
  }
}

export default AuthService;