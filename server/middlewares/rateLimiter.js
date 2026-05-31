import rateLimit from "express-rate-limit";

// Global rate limiter for all routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Stricter rate limiter for API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many API requests from this IP, please try again after 15 minutes",
  },
});

// Specific rate limiter for GitHub Sync (1 request per 15 mins)
export const githubSyncLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // Limit each IP/user to 1 request per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "GitHub data can only be synced once every 15 minutes. Please wait before syncing again.",
  },
  // Key generator uses user ID if available, otherwise fallback to IP
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return req.user._id.toString();
    }
    // Fallback to forwarded IP or remote address to bypass express-rate-limit IPv6 validation error
    // while still effectively rate-limiting by IP for unauthenticated users.
    return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString();
  }
});

// ── APEX Chat rate limiter ─────────────────────────────────────────────────────
//
// Why userId-keyed and NOT IP-keyed:
//   - APEX routes require auth — req.user._id is always available here
//   - IP-based limiting would unfairly penalize users behind shared NAT/proxies
//   - Each user should get their own independent quota
//
// Limits: 20 messages per user per 60 minutes.
//   - Sufficient for real, focused usage sessions (a good conversation rarely needs more)
//   - Prevents runaway API cost if a user spams or a client bug loops requests
//   - Protects the free-tier Gemini quota (1500 req/day shared across all users)
export const apexChatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20,                   // 20 messages per user per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You have reached the APEX chat limit of 20 messages per hour. Please wait before sending more messages.",
  },
  // Always key by userId — APEX routes are always authenticated
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return `apex:${req.user._id.toString()}`;
    }
    // Should never reach here since authMiddleware runs before this,
    // but safe fallback to prevent server errors
    return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString();
  },
  // Skip rate limiting for non-message routes (create, list, load, delete)
  // Only the sendMessage endpoint (POST /:id/message) should be limited
  skip: (req) => {
    // Only apply to POST requests that match the message endpoint pattern
    // i.e. POST /api/ai/apex/conversations/:id/message
    return !(req.method === "POST" && req.path.endsWith("/message"));
  },
});

