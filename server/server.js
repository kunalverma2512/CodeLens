import app from './app.js';
import connectDB from './config/db.js';
import './config/env.js';
import { connectToRedis } from './config/redis.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await connectToRedis();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
