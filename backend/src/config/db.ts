import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config({ path: './src/config/config.env' });

export default new Redis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  db: 0, // Defaults to 0
});
