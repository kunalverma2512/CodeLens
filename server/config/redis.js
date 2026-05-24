import { createClient } from "redis";

let redisClient;
let connectPromise;

export const getRedisClient = async () => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
  }

  if (!redisClient) {
    redisClient = createClient({ url: redisUrl });
    redisClient.on("error", (error) => {
      console.error("Redis client error:", error);
    });
  }

  if (!redisClient.isOpen) {
    if (!connectPromise) {
      connectPromise = redisClient.connect().finally(() => {
        connectPromise = null;
      });
    }

    await connectPromise;
  }

  return redisClient;
};