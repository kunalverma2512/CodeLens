
import User from "../../models/User.js";
import Otp from "../../models/Otp.js";

class AuthRepository {
  // =========================
  // USER METHODS
  // =========================

  static async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async findUserByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  static async findUserByEmailWithoutPassword(email) {
    return await User.findOne({ email });
  }

  static async findUserById(id) {
    return await User.findById(id);
  }

  static async findUserByGithubId(githubId) {
    return await User.findOne({ "oauth.github.id": githubId });
  }

  static async updateUserVerification(email) {
    return await User.findOneAndUpdate(
      { email },
      {
        $set: {
          isVerified: true,
        },
      },
      { new: true, runValidators: true }
    );
  }

  static async updateUserPassword(email, hashedPassword) {
    return await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true, runValidators: true }
    );
  }

  static async updateUserGithubIdentity(userId, githubIdentity = {}) {
    const updateData = {
      "oauth.github.id": githubIdentity.id,
      "oauth.github.username": githubIdentity.username,
      "oauth.github.profileUrl": githubIdentity.profileUrl,
      "handles.github": githubIdentity.username,
    };

    if (githubIdentity.avatarUrl) {
      updateData["profile.avatar"] = githubIdentity.avatarUrl;
    }

    if (githubIdentity.accessToken) {
      updateData["oauth.github.accessToken"] =
        githubIdentity.accessToken;
    }

    return await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // =========================
  // OTP METHODS
  // =========================

  static async createOtp({ email, otp, purpose }) {
    return await Otp.findOneAndUpdate(
      { email, purpose },
      {
        $set: {
          otp,
          failedAttempts: 0,
          lockUntil: null,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  static async findOtp(email, purpose) {
    return await Otp.findOne({ email, purpose });
  }

  // =========================
  // OTP SAFETY METHODS
  // =========================

  static async incrementOtpFailure(
    email,
    purpose,
    threshold = 5,
    lockMinutes = 15
  ) {
    const otpDoc = await Otp.findOne({ email, purpose });

    if (!otpDoc) {
      return null;
    }

    otpDoc.failedAttempts =
      (otpDoc.failedAttempts || 0) + 1;

    if (otpDoc.failedAttempts >= threshold) {
      otpDoc.lockUntil = new Date(
        Date.now() + lockMinutes * 60 * 1000
      );
    }

    await otpDoc.save();

    return otpDoc;
  }

  static async resetOtp(email, purpose) {
    return await Otp.findOneAndUpdate(
      { email, purpose },
      {
        $set: {
          failedAttempts: 0,
          lockUntil: null,
        },
      },
      { new: true }
    );
  }

  static async deleteOtp(email, purpose) {
    return await Otp.deleteMany({ email, purpose });
  }
}

export default AuthRepository;
