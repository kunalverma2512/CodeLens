import { createClient } from 'redis';

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis cache.");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};