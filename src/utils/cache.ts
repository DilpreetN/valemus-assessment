const cache = new Map<string, unknown>();

export const jsonStore = {
  get<T>(key: string): T | undefined {
    return cache.get(key) as T | undefined;
  },

  set<T>(key: string, data: T): void {
    cache.set(key, data);
  },
};
