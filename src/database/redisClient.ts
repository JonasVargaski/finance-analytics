import Redis from 'ioredis';
import { env } from '../config/env';

console.log({
  host: env.REDIS_HOST,
  port: env.APP_PORT,
});

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.APP_PORT,
});

export { redisClient };
