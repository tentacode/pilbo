jest.mock("expo-crypto", () => ({ randomUUID: () => crypto.randomUUID() }));
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: "light" },
  NotificationFeedbackType: { Success: "success" },
}));
jest.mock("react-native-worklets", () => jest.requireActual("react-native-worklets/src/mock"));
jest.mock("expo-sqlite/kv-store", () => {
  const items = new Map<string, string>();
  const storage = {
    getItemSync: (key: string) => items.get(key) ?? null,
    setItemSync: (key: string, value: string) => {
      items.set(key, value);
    },
    removeItemSync: (key: string) => items.delete(key),
    clearSync: () => {
      items.clear();
      return true;
    },
  };
  return { __esModule: true, default: storage, Storage: storage };
});
