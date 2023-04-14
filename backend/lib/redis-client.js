import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

export default new Redis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 0, // Defaults to 0
});