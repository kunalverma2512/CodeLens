import bcrypt from "bcryptjs";
import crypto from "crypto";
import axios from "axios";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";
import AuthRepository from "./repository.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenHelper.js";
import { generateOTP } from "../../utils/otpHelper.js";
import { sendVerificationOTP, sendPasswordResetOTP } from "../../utils/emailService.js";

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const GITHUB_USER_EMAILS_URL = "https://api.github.com/user/emails";
const GITHUB_SCOPE = "read:user user:email";

class AuthService {
  // ── Registration ────────────────────────────────────────────────────────────

  static async register({ name, email, password }) {
    const existingUser = await AuthRepository.findUserByEmailWithoutPassword(email);
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 4);

    await AuthRepository.createOtp({ email, otp: hashedOtp, purpose: "signup" });
    await sendVerificationOTP(email, plainOtp);

    return {
      message: "Registration successful. Please check your email for OTP verification.",
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
    };
  }

  // ── OTP Verification ────────────────────────────────────────────────────────

  static async verifyOtp({ email, otp }) {
    const otpRecord = await AuthRepository.findOtp(email, "signup");
    if (!otpRecord) {
      throw new ApiError(400, "OTP expired or not found");
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      throw new ApiError(400, "Invalid OTP");
    }

    await AuthRepository.updateUserVerification(email);
    await AuthRepository.deleteOtp(email, "signup");

    const user = await AuthRepository.findUserByEmailWithoutPassword(email);
    const { accessToken, refreshToken } = this.#generateTokenPair(user);

    return {
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: this.#sanitizeUser(user)
    };
  }

  // ── Login ────────────────────────────────────────────────────────────────────

  static async login({ email, password }) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // GitHub-only accounts have a random password the user doesn't know.
    // Checking authProvider alone is correct — they always have a hashed password,
    // so !user.password would always be false and the guard would never fire.
    if (user.authProvider === "github") {
      throw new ApiError(401, "This account was created with GitHub. Please use 'Continue with GitHub' to sign in.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email first");
    }

    const { accessToken, refreshToken } = this.#generateTokenPair(user);

    user.activity.lastActive = new Date();
    await user.save();

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: this.#sanitizeUser(user)
    };
  }

  // ── Forgot / Reset Password ──────────────────────────────────────────────────

  static async forgotPassword({ email }) {
    const user = await AuthRepository.findUserByEmailWithoutPassword(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 4);

    await AuthRepository.createOtp({ email, otp: hashedOtp, purpose: "forgot-password" });
    await sendPasswordResetOTP(email, plainOtp);

    return { message: "Password reset OTP sent to your email" };
  }

  static async resetPassword({ email, otp, newPassword }) {
    const otpRecord = await AuthRepository.findOtp(email, "forgot-password");
    if (!otpRecord) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AuthRepository.updateUserPassword(email, hashedPassword);
    await AuthRepository.deleteOtp(email, "forgot-password");

    return { message: "Password reset successful" };
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────────

  static async resendOtp({ email, purpose }) {
    const user = await AuthRepository.findUserByEmailWithoutPassword(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (purpose === "signup" && user.isVerified) {
      throw new ApiError(400, "Already verified");
    }

    await AuthRepository.deleteOtp(email, purpose);

    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 4);

    await AuthRepository.createOtp({ email, otp: hashedOtp, purpose });

    if (purpose === "signup") {
      await sendVerificationOTP(email, plainOtp);
    } else {
      await sendPasswordResetOTP(email, plainOtp);
    }

    return { message: "OTP resent successfully" };
  }

  // ── GitHub OAuth — Start ─────────────────────────────────────────────────────

  /**
   * Builds the GitHub authorization URL for login/signup flows.
   * mode = "login" | "connect"
   * userId is required for "connect" mode (embedded in state JWT).
   */
  static getGithubAuthorizationUrl({ mode = "login", userId = null, redirectPath }) {
    this.#assertGithubOAuthConfig();

    const safeMode = mode === "connect" ? "connect" : "login";
    const defaultRedirectPath = safeMode === "connect" ? "/account-center" : "/dashboard";
    const state = this.#buildGithubStateToken({
      mode: safeMode,
      userId,
      redirectPath: redirectPath || defaultRedirectPath
    });

    const query = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: GITHUB_SCOPE,
      state,
      allow_signup: "true"
    });

    return `${GITHUB_OAUTH_URL}?${query.toString()}`;
  }

  /**
   * Used by the /github/connect-init API endpoint.
   * Requires an authenticated user (via cookie middleware) to build the connect URL.
   * Returns just the URL string — the frontend navigates to it.
   */
  static getGithubConnectUrl({ userId, redirectPath }) {
    if (!userId) {
      throw new ApiError(401, "You must be logged in to connect a GitHub account.");
    }
    return this.getGithubAuthorizationUrl({
      mode: "connect",
      userId: String(userId),
      redirectPath: redirectPath || "/account-center"
    });
  }

  // ── GitHub OAuth — Callback ──────────────────────────────────────────────────

  static async handleGithubCallback({ code, state }) {
    this.#assertGithubOAuthConfig();

    const decodedState = this.#verifyGithubStateToken(state);
    const githubToken = await this.#exchangeGithubCodeForToken(code);
    const githubProfile = await this.#fetchGithubUserProfile(githubToken);
    const githubEmail = await this.#resolveGithubEmail(githubToken, githubProfile?.email);

    // ── Connect mode: link GitHub to an existing authenticated user ───────
    if (decodedState.mode === "connect") {
      const connectedUser = await this.#connectGithubForAuthenticatedUser({
        userId: decodedState.userId,
        githubProfile,
        githubToken
      });

      // No token needed — user is already logged in via cookie.
      // Just redirect back with a success query param.
      return {
        mode: "connect",
        redirectUrl: this.#buildFrontendRedirectUrl(
          decodedState.redirectPath || "/account-center",
          {
            githubStatus: "connected",
            githubUsername: connectedUser?.oauth?.github?.username || githubProfile?.login || ""
          }
        )
      };
    }

    // ── Login/Signup mode: find or create user ─────────────────────────────
    const user = await this.#findOrCreateGithubUser({
      githubProfile,
      githubEmail,
      githubToken
    });

    const { accessToken, refreshToken } = this.#generateTokenPair(user);

    return {
      mode: "login",
      accessToken,
      refreshToken,
      user: this.#sanitizeUser(user),
      // Redirect to the GitHubCallbackPage which will fetch the profile and navigate
      redirectUrl: this.#buildFrontendRedirectUrl(
        "/auth/github/callback",
        {
          authStatus: "success",
          redirectTo: decodedState.redirectPath || "/dashboard"
        }
      )
    };
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  static #generateTokenPair(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
    };
  }

  static #assertGithubOAuthConfig() {
    const required = ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GITHUB_CALLBACK_URL", "CLIENT_URL"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new ApiError(500, `Missing GitHub OAuth environment variables: ${missing.join(", ")}`);
    }
  }

  static #buildGithubStateToken(payload) {
    const secret = process.env.GITHUB_STATE_SECRET || process.env.JWT_SECRET;
    return jwt.sign(payload, secret, { expiresIn: "10m" });
  }

  static #verifyGithubStateToken(token) {
    try {
      const secret = process.env.GITHUB_STATE_SECRET || process.env.JWT_SECRET;
      return jwt.verify(token, secret);
    } catch {
      throw new ApiError(400, "Invalid or expired GitHub OAuth state");
    }
  }

  static async #exchangeGithubCodeForToken(code) {
    try {
      const response = await axios.post(
        GITHUB_ACCESS_TOKEN_URL,
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_CALLBACK_URL
        },
        { headers: { Accept: "application/json" } }
      );

      const accessToken = response?.data?.access_token;
      if (!accessToken) {
        throw new ApiError(400, "GitHub did not return an access token");
      }
      return accessToken;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, "Failed to exchange GitHub code for access token");
    }
  }

  static async #fetchGithubUserProfile(accessToken) {
    try {
      const response = await axios.get(GITHUB_USER_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "CodeLens-App"
        }
      });
      return response.data;
    } catch {
      throw new ApiError(400, "Failed to fetch GitHub profile");
    }
  }

  static async #resolveGithubEmail(accessToken, profileEmail) {
    if (profileEmail) return profileEmail;

    try {
      const response = await axios.get(GITHUB_USER_EMAILS_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "CodeLens-App"
        }
      });

      const emails = Array.isArray(response.data) ? response.data : [];
      const preferredEmail =
        emails.find((entry) => entry.primary && entry.verified)?.email ||
        emails.find((entry) => entry.verified)?.email ||
        emails[0]?.email;

      return preferredEmail || null;
    } catch {
      return null;
    }
  }

  static async #connectGithubForAuthenticatedUser({ userId, githubProfile, githubToken }) {
    if (!userId) {
      throw new ApiError(400, "Missing user information in GitHub connect flow");
    }

    const existingByGithub = await AuthRepository.findUserByGithubId(String(githubProfile.id));
    if (existingByGithub && String(existingByGithub._id) !== String(userId)) {
      throw new ApiError(409, "This GitHub account is already linked to another user");
    }

    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const linkedUser = await AuthRepository.updateUserGithubIdentity(userId, {
      id:          String(githubProfile.id),
      username:    githubProfile.login,
      profileUrl:  githubProfile.html_url,
      avatarUrl:   githubProfile.avatar_url,
      accessToken: githubToken,
    });

    return linkedUser;
  }

  static async #findOrCreateGithubUser({ githubProfile, githubEmail, githubToken }) {
    const githubId = String(githubProfile.id);
    const githubUsername = githubProfile.login;
    const githubProfileUrl = githubProfile.html_url;
    const githubAvatar = githubProfile.avatar_url;

    // ── Case 1: GitHub ID already in DB (returning user) ──────────────────
    let user = await AuthRepository.findUserByGithubId(githubId);
    if (user) {
      user.activity.lastActive = new Date();
      await user.save();
      return user;
    }

    // ── Case 2: Email exists (local account) — merge GitHub into it ────────
    if (githubEmail) {
      const existingByEmail = await AuthRepository.findUserByEmailWithoutPassword(githubEmail);
      if (existingByEmail) {
        const linked = await AuthRepository.updateUserGithubIdentity(existingByEmail._id, {
          id:          githubId,
          username:    githubUsername,
          profileUrl:  githubProfileUrl,
          avatarUrl:   githubAvatar,
          accessToken: githubToken,
        });
        // Mark as verified if not already (GitHub emails are verified)
        if (!existingByEmail.isVerified) {
          await AuthRepository.updateUserVerification(githubEmail);
        }
        linked.activity.lastActive = new Date();
        await linked.save();
        return linked;
      }
    }

    // ── Case 3: No email from GitHub ───────────────────────────────────────
    if (!githubEmail) {
      throw new ApiError(
        422,
        "GitHub account does not expose an email. Please make your primary email public on GitHub and try again."
      );
    }

    // ── Case 4: Brand new user via GitHub ──────────────────────────────────
    const generatedPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    user = await AuthRepository.createUser({
      name: githubProfile.name || githubUsername,
      email: githubEmail,
      password: hashedPassword,
      isVerified: true,
      authProvider: "github",
      profile: { avatar: githubAvatar || "" },
      handles: { github: githubUsername },
      oauth: {
        github: {
          id:          githubId,
          username:    githubUsername,
          profileUrl:  githubProfileUrl,
          accessToken: githubToken,
        }
      },
      activity: { lastActive: new Date() }
    });

    return user;
  }

  static #sanitizeUser(user) {
    return {
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
              // Never expose accessToken to the client
            }
          : undefined
      }
    };
  }

  static #buildFrontendRedirectUrl(path, query = {}) {
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirect = new URL(path || "/", baseUrl);

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        redirect.searchParams.set(key, String(value));
      }
    });

    return redirect.toString();
  }
}

export default AuthService;
