import express from 'express';
import cors from "cors";

const app = express();

const allowedOrigins = [
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
app.options("*", cors(corsOptions));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CodeLens API is running' });
});

export default app;
