import express from 'express';
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/user/routes.js";
import codeforcesRoutes from "./modules/codeforces/routes.js";
import aiRoutes from "./modules/ai/routes.js";
import githubRoutes from "./modules/github/routes.js";

const app = express();

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
