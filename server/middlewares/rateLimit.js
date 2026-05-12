import ApiResponse from "../utils/ApiResponse.js";

const WINDOW_CLEANUP_INTERVAL = 5 * 60 * 1000;

export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 20,
  keyGenerator,
  message = "Too many requests. Please try again later."
} = {}) => {
  const requestBuckets = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requestBuckets.entries()) {
      const filtered = timestamps.filter((timestamp) => now - timestamp < windowMs);
      if (filtered.length === 0) {
        requestBuckets.delete(key);
      } else {
        requestBuckets.set(key, filtered);
      }
    }
  }, WINDOW_CLEANUP_INTERVAL).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key =
      keyGenerator?.(req) ||
      `${req.ip || "unknown-ip"}:${req.path}:${req.method}`;

    const existing = requestBuckets.get(key) || [];
    const recent = existing.filter((timestamp) => now - timestamp < windowMs);

    if (recent.length >= max) {
      return res
        .status(429)
        .json(ApiResponse.error(message));
    }

    recent.push(now);
    requestBuckets.set(key, recent);
    next();
  };
};

export default createRateLimiter;
