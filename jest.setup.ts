import "react-native-gesture-handler/jestSetup";

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
jest.mock("@expo/ui/swift-ui", () => {
  const { createElement } = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Host: ({ children }: { children: unknown }) => children,
    DatePicker: (props: object) => createElement(View, { testID: "date-picker", ...props }),
  };
});
jest.mock("@expo/ui/swift-ui/modifiers", () => ({
  accessibilityLabel: (label: string) => ({ accessibilityLabel: label }),
  datePickerStyle: (style: string) => ({ datePickerStyle: style }),
  environment: (key: string, value: string) => ({ environment: { key, value } }),
  labelsHidden: () => ({ labelsHidden: true }),
  tint: (color: string) => ({ tint: color }),
}));
jest.mock("react-native-reanimated", () => {
  const reanimated =
    jest.requireActual<typeof import("react-native-reanimated")>("react-native-reanimated");
  return {
    __esModule: true,
    ...reanimated,
    default: reanimated.default,
    useAnimatedKeyboard: () => ({ height: { get: () => 0 }, state: { get: () => 0 } }),
  };
});
