import User from "../../models/User.js";
import {redisClient} from "../../config/redis.js";

class AuthRepository {
  static async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }
  static async updateUserPassword(email, hashedPassword) {
    return await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
  }
  static async findUserByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  static async findUserByEmailWithoutPassword(email) {
    return await User.findOne({ email });
  }

  // --- Redis OTP Methods ---
  static async storePendingUser(email, data, ttl = 600) {
    // Stores user data and OTP in Redis with a 10-minute expiry
    await redisClient.set(`pending_user:${email}`, JSON.stringify(data), "EX", ttl);
  }
  static async getPendingUser(email) {
    const data = await redisClient.get(`pending_user:${email}`);
    return data ? JSON.parse(data) : null;
  }

  static async deletePendingUser(email) {
    await redisClient.del(`pending_user:${email}`);
  }

  static async storeOtp(email, purpose, otp, ttl = 600) {
    await redisClient.set(`otp:${purpose}:${email}`, otp, "EX", ttl);
  }

  static async getOtp(email, purpose) {
    return await redisClient.get(`otp:${purpose}:${email}`);
  }

  static async deleteOtp(email, purpose) {
    await redisClient.del(`otp:${purpose}:${email}`);
  }
}

export default AuthRepository;

