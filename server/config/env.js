import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000").transform((val) => parseInt(val, 10)),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters long"),
  JWT_EXPIRES_IN: z.string().default("24h"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  parsed.error.errors.forEach((err) => {
    console.error(`   - ${err.path.join(".")}: ${err.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
export default env;
