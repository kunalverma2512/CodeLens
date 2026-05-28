
import dotenv from "dotenv";

// FORCE load .env from correct path
dotenv.config({ path: "./.env" });

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLIENT_URL",
  "NODE_ENV",
  "GEMINI_API_KEY",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GITHUB_CALLBACK_URL"
];

const missingEnvVars = requiredEnvVars.filter(
  (key) => !process.env[key]
);

console.log("DEBUG ENV:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "OK" : "MISSING"
});

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export default process.env;
