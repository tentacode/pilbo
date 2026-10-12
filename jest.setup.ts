jest.mock("expo-crypto", () => ({ randomUUID: () => crypto.randomUUID() }));
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: "light" },
}));
