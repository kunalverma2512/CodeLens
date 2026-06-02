import express from 'express';
import cors from "cors";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/user/routes.js";
import codeforcesRoutes from "./modules/codeforces/routes.js";
import aiRoutes from "./modules/ai/routes.js";
import githubRoutes from "./modules/github/routes.js";

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  res.removeHeader("X-Powered-By");
  next();
});

// Rate Limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URI,
  "http://localhost:5173"
].filter(Boolean);

const corsOptions ={
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CodeLens API is running' });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/codeforces", codeforcesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/github", githubRoutes);

// 404 catch-all route
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler middleware
app.use(errorHandler);

export default app;
