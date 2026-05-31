import mongoose from "mongoose";

const githubDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One GitHub data record per user
    index: true,
  },
  data: {
    type: Object, // Store the entire aggregated dashboard data
    required: true,
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model("GithubData", githubDataSchema);
