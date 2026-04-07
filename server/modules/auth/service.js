import bcrypt from "bcryptjs";
import ApiError from "../../utils/ApiError.js";
import AuthRepository from "./repository.js";
import { generateAccessToken } from "../../utils/tokenHelper.js";
import { generateOTP } from "../../utils/otpHelper.js";
import { sendVerificationOTP, sendPasswordResetOTP } from "../../utils/emailService.js";

class AuthService {
  static async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await AuthRepository.findUserByEmailWithoutPassword(email);
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate OTP
    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 4);

    // Store user data + hashed OTP in Redis instead of creating a DB record
    await AuthRepository.storePendingUser(email, {
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp
    });
    // Send verification email with plain OTP
    await sendVerificationOTP(email, plainOtp);

    return { message: "OTP sent to your email for verification." };
  }

  static async verifyOtp({ email, otp }) {
    const pendingUser = await AuthRepository.getPendingUser(email);
    if (!pendingUser) throw new ApiError(400, "OTP expired or invalid session");

    const isValidOtp = await bcrypt.compare(otp, pendingUser.otp);
    if (!isValidOtp) throw new ApiError(400, "Invalid OTP");

    // Persist to MongoDB ONLY after verification
    const user = await AuthRepository.createUser({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password
    });

    await AuthRepository.deletePendingUser(email);

    const token = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
    return { message: "Email verified and account created", token, user };
  }

  static async login({ email, password }) {
    // Find user with password
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate token
    const token = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Update last active
    user.activity.lastActive = new Date();
    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    return { message: "Login successful", token, user: sanitizedUser };
  }

  static async forgotPassword({ email }) {
    // Find user
    const user = await AuthRepository.findUserByEmailWithoutPassword(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate OTP
    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 4);

    // Store hashed OTP in Redis
    await AuthRepository.storeOtp(email, "forgot-password", hashedOtp);

    // Send password reset email
    await sendPasswordResetOTP(email, plainOtp);

    return {
      message: "Password reset OTP sent to your email"
    };
  }

  static async resetPassword({ email, otp, newPassword }) {
    // Retrieve OTP record from Redis
    const storedHashedOtp = await AuthRepository.getOtp(email, "forgot-password");
    if (!storedHashedOtp) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    // Verify OTP
    const isValidOtp = await bcrypt.compare(otp, storedHashedOtp);
    if (!isValidOtp) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await AuthRepository.updateUserPassword(email, hashedPassword);

    // Delete OTP record from Redis
    await AuthRepository.deleteOtp(email, "forgot-password");

    return {
      message: "Password reset successful"
    };
  }

  static async resendOtp({ email, purpose }) {
    // Generate new OTP
    const plainOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(plainOtp, 4);

    if (purpose === "signup") {
      // Check if user already exists in DB (meaning they are already verified)
      const user = await AuthRepository.findUserByEmailWithoutPassword(email);
      if (user) {
        throw new ApiError(400, "Already verified");
      }

      // Find pending registration in Redis
      const pendingUser = await AuthRepository.getPendingUser(email);
      if (!pendingUser) {
        throw new ApiError(404, "No pending registration found. Please register again.");
      }

      // Update the OTP in Redis for the pending user
      pendingUser.otp = hashedOtp;
      await AuthRepository.storePendingUser(email, pendingUser);

      // Send verification email
      await sendVerificationOTP(email, plainOtp);
      
    } else if (purpose === "forgot-password") {
      // Find user
      const user = await AuthRepository.findUserByEmailWithoutPassword(email);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Overwrite existing OTP in Redis
      await AuthRepository.storeOtp(email, purpose, hashedOtp);

      // Send password reset email
      await sendPasswordResetOTP(email, plainOtp);
      
    } else {
      throw new ApiError(400, "Invalid OTP purpose");
    }

    return {
      message: "OTP resent successfully"
    };
  }
}

export default AuthService;