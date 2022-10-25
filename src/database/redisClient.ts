import Redis from 'ioredis';
import { env } from '../config/env';

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

export { redisClient };
