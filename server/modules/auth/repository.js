
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
      { isVerified: true },
      { returnDocument: "after" }
    );
  }

  static async updateUserPassword(email, hashedPassword) {
    return await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { returnDocument: "after" }
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
      updateData,
      {
        returnDocument: "after",
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

  // =========================
  // OTP FETCH
  // =========================

  static async findOtp(email, purpose) {
    return await Otp.findOne({ email, purpose });
  }

  // =========================
  // OTP SAFETY METHODS
  // =========================

  static async incrementOtpFailure(email, purpose) {
    return await Otp.findOneAndUpdate(
      { email, purpose },
      { $inc: { failedAttempts: 1 } },
      { returnDocument: "after" }
    );
  }

  static async lockOtp(email, purpose, lockMinutes = 15) {
    return await Otp.findOneAndUpdate(
      { email, purpose },
      {
        lockUntil: new Date(
          Date.now() + lockMinutes * 60 * 1000
        ),
      },
      { returnDocument: "after" }
    );
  }

  static async resetOtp(email, purpose) {
    return await Otp.findOneAndUpdate(
      { email, purpose },
      {
        failedAttempts: 0,
        lockUntil: null,
      },
      { returnDocument: "after" }
    );
  }

  static async deleteOtp(email, purpose) {
    return await Otp.deleteMany({ email, purpose });
  }
}

export default AuthRepository;

