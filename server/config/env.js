import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  // JWT_REFRESH_SECRET must be a separate key from JWT_SECRET.
  // Using the same key for both would allow forging refresh tokens from an access token.
  "JWT_REFRESH_SECRET",
  "GEMINI_API_KEY",
  "CLIENT_URL",
  "NODE_ENV",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL"
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || "CodeLens"
};

export default env;
