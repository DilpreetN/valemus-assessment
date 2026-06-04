import { jsonStore } from "./cache";

export const fetchAsync = async <T>(key: string) => {
  console.log("fetch", key);
  const cached = jsonStore.get<T>(key);
  console.log("cached", cached);
  if (cached != null) return cached;

  const res = await fetch(`/assets/${key}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data: T = await res.json();

  jsonStore.set(key, data);
  return data;
};
