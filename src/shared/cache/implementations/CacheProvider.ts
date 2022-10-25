import { ICacheProvider } from '../ICacheProvider';
import { redisClient } from '../../../database/redisClient';

export class CacheProvider implements ICacheProvider {
  async invalidate(prefixKey: string): Promise<number> {
    const res = await redisClient.del(prefixKey);
    return res;
  }

  async invalidatePrefix(prefixKey: string): Promise<number> {
    const keys = await redisClient.keys(`${prefixKey}:*`);
    const res = await redisClient.del(keys);
    return res;
  }

  async get<T>(key: string): Promise<T> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, data: any, expireIn = 60 * 60 * 24): Promise<void> {
    await redisClient.set(key, data, 'EX', expireIn);
  }
}
