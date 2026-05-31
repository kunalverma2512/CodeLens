import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Auth
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  authProvider: { type: String, enum: ["local", "google", "github"], default: "local" },

  // Profile Info
  profile: {
    avatar: { type: String, default: "" },
    bio: String,
    college: String,
    location: String,
    skills: [{ name: String, level: { type: String, enum: ["beginner", "intermediate", "advanced"] } }]
  },

  // Platform Usernames
  handles: { codeforces: String, leetcode: String, github: String },

  // OAuth Identities
  oauth: {
    github: {
      id:               { type: String, unique: true, sparse: true, index: true },
      username:         String,
      profileUrl:       String,
      accessToken:      { type: String, select: false }, // stored for GitHub API calls
    }
  },

  // Stats References (decoupled)
  stats: {
    cpStats: { type: mongoose.Schema.Types.ObjectId, ref: "CPStats" },
    githubStats: { type: mongoose.Schema.Types.ObjectId, ref: "GithubStats" },
    analytics: { type: mongoose.Schema.Types.ObjectId, ref: "Analytics" }
  },

  // Goals
  goals: [{
    title: String,
    type: { type: String, enum: ["cp", "dev", "general"] },
    target: Number,
    progress: { type: Number, default: 0 },
    deadline: Date
  }],

  // Activity
  activity: {
    lastActive: Date,
    streak: { current: { type: Number, default: 0 }, longest: { type: Number, default: 0 } }
  },

  // Preferences
  preferences: {
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    emailNotifications: { type: Boolean, default: true }
  },

  // Security
  security: {
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    // Hashed refresh token — enables server-side logout/revocation.
    // We store the hash (not the raw token) so a DB breach doesn't expose live tokens.
    refreshTokenHash: { type: String, select: false }
  },

  // Metadata
  metadata: {
    onboardingCompleted: { type: Boolean, default: false },
    tags: [String]
  },

  // Dashboard AI Summary Cache
  dashboardSummary: {
    content: { type: String, default: null },
    lastGeneratedAt: { type: Date, default: null }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
