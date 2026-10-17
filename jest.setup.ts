jest.mock("expo-crypto", () => ({ randomUUID: () => crypto.randomUUID() }));
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: "light" },
  NotificationFeedbackType: { Success: "success" },
}));
jest.mock("react-native-worklets", () => jest.requireActual("react-native-worklets/src/mock"));
