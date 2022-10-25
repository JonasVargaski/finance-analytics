export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, expireIn?: number): Promise<void>;
  invalidate(prefixKey: string): Promise<number>;
  invalidatePrefix(prefixKey: string): Promise<number>;
}
