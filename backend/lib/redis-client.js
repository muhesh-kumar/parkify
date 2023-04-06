require('dotenv').config();
const Redis = require('ioredis');

module.exports = new Redis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 0, // Defaults to 0
});
