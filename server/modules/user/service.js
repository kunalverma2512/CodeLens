import CodeforcesRepository from "../codeforces/repository.js";
import UserRepository from "./repository.js";
import ApiError from "../../utils/ApiError.js";

class UserService {
  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  static async updateProfile(userId, updateData) {
    const allowedFields = {};
    
    if (updateData.name !== undefined) {
      allowedFields.name = updateData.name;
    }
    if (updateData.profile !== undefined) {
      allowedFields.profile = updateData.profile;
    }
    if (updateData.handles !== undefined) {
      allowedFields.handles = updateData.handles;
    }
    if (updateData.preferences !== undefined) {
      allowedFields.preferences = updateData.preferences;
    }

    const user = await UserRepository.updateProfile(userId, allowedFields);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  static async deleteAccount(userId) {
    // Cascade delete related records
    await CodeforcesRepository.deleteProfileByUserId(userId);
    await CodeforcesRepository.deleteSubmissionsByUserId(userId);
    await CodeforcesRepository.deleteRatingHistoryByUserId(userId);

    const user = await UserRepository.deleteUser(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }
}

export default UserService;
