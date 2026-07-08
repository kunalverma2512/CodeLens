import express from 'express';
import cors from "cors";
import helmet from "helmet";           // FIX #6 — adds 11 security headers
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/user/routes.js";
import codeforcesRoutes from "./modules/codeforces/routes.js";
import aiRoutes from "./modules/ai/routes.js";
import githubRoutes from "./modules/github/routes.js";
import { globalLimiter, apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// ── Trust Proxy (REQUIRED for Render deployment) ──────────────────────────────
// Render sits behind a reverse proxy. Without this, express-rate-limit sees
// the proxy's IP for every user — meaning the first user to hit the rate limit
// blocks EVERYONE. This tells Express to trust the X-Forwarded-For header from
// Render's proxy layer so each real client IP is identified separately.
app.set("trust proxy", 1);

// ── FIX #6 — Security headers via helmet ──────────────────────────────────────
// Must be the FIRST middleware so headers are set on every response including
// error responses. crossOriginResourcePolicy allows Vercel → Render requests.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ── Allowed CORS origins ──────────────────────────────────────────────────────
// CLIENT_URL must be your live Vercel URL in production, e.g. https://codelens.vercel.app

// FIX #3 — warn loudly if CLIENT_URL is missing in production so the issue
// is immediately visible in logs instead of silently blocking all prod requests.
if (!process.env.CLIENT_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "[CORS] WARNING: CLIENT_URL environment variable is not set. " +
    "All cross-origin requests will be blocked in production."
  );
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  // Allow localhost in non-production environments for local development
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173"] : []),
].filter(Boolean); // safely removes undefined/null if CLIENT_URL is not set

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, server-to-server calls)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // FIX #8 — log blocked origin server-side but return a generic message
      // to the client. Revealing the exact blocked origin helps attackers.
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,             // Required for cookies to be sent cross-origin
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ── Body parsers ──────────────────────────────────────────────────────────────
// FIX #5 — explicit 50KB size limit prevents DoS via oversized payloads.
// strict:true rejects bare strings/numbers (only arrays and objects accepted).
app.use(express.json({ limit: "50kb", strict: true }));

// FIX #7 — urlencoded parser for HTML form submissions and some OAuth callbacks.
// Without this, req.body is {} for application/x-www-form-urlencoded requests.
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// ── FIX #5 — 413 Payload Too Large handler ────────────────────────────────────
// express.json() throws an error with type "entity.too.large" when the body
// exceeds the limit. Without this, it falls through to the generic 500 handler.
// Place this BEFORE cookieParser and routes so it catches parse errors early.
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body too large. Maximum allowed size is 50KB.",
    });
  }
  next(err);
});

// ── Cookie Parser ─────────────────────────────────────────────────────────────
// Must come BEFORE routes so req.cookies is populated when route handlers run.
app.use(cookieParser());

// ── Health check ──────────────────────────────────────────────────────────────
// FIX #1 — health check placed BEFORE globalLimiter so uptime monitors and
// load balancers are never rate-limited. This is intentional and correct.
// FIX #9 — enriched response includes environment, timestamp, and version
// so monitoring dashboards get useful context at a glance.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "CodeLens API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// ── Rate Limiters ─────────────────────────────────────────────────────────────
// FIX #1 — globalLimiter moved AFTER health check so /api/health is excluded.
// FIX #2 — The original code applied globalLimiter to ALL routes AND then
// applied apiLimiter again to /api/* — causing double rate-limiting on every
// API endpoint. Two correct approaches:
//
// Option A (current): Keep both for intentional layered limiting:
//   globalLimiter = broad DoS protection (e.g. 500 req/15min per IP)
//   apiLimiter    = stricter API protection (e.g. 100 req/15min per IP)
//   This means /api/* requests consume from BOTH windows simultaneously.
//   → Only use this if your rateLimiter.js defines different windows/maxes.
//
// Option B: Remove globalLimiter and use only route-specific limiters.
//   → Simpler, easier to reason about.
//
// If both limiters have the same config, remove globalLimiter below.
// If they have different configs (different max/windowMs), both are correct here.
app.use(globalLimiter);        // Broad protection for all routes
app.use("/api", apiLimiter);   // Stricter limit for all /api/* routes

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/user",       userRoutes);
app.use("/api/codeforces", codeforcesRoutes);
app.use("/api/ai",         aiRoutes);
app.use("/api/github",     githubRoutes);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
// FIX #4 — uses next(err) so the error flows through errorHandler middleware
// consistently. The original used res.json() directly which bypasses
// errorHandler and can't be intercepted for logging or custom error shaping.
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// ── Global error handler ──────────────────────────────────────────────────────
// Must be the LAST middleware and MUST have 4 arguments (err, req, res, next).
// All errors passed via next(err) anywhere in the app land here.
app.use(errorHandler);

export default app;
