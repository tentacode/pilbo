import Storage from "expo-sqlite/kv-store";

// Sync methods: persisted stores are hydrated before the first render, no flash at startup.
export const synchronousStorage = {
  getItem: (key: string) => Storage.getItemSync(key),
  setItem: (key: string, value: string) => Storage.setItemSync(key, value),
  removeItem: (key: string) => {
    Storage.removeItemSync(key);
  },
};
