import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { router } from "expo-router";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { DayScreen } from "./DayScreen";

let mockDatabase: Database;
let mockDate = "2026-10-21";

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
  subscribeToDatabaseChanges: () => () => {},
}));
jest.mock("@/features/notifications/notifications", () => ({
  getPermissionStatus: () => Promise.resolve("granted"),
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    router: { back: jest.fn(), navigate: jest.fn() },
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
    useLocalSearchParams: () => ({ date: mockDate }),
  };
});

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("DayScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 24, 10, 0));
    jest.clearAllMocks();
    mockDate = "2026-10-21";
    mockDatabase = createTestDatabase();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the past day of the route in read only, without day navigation", async () => {
    await render(<DayScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Mercredi 21 octobre" })).toBeOnTheScreen();
    expect(screen.getByLabelText("08:20, Non prise")).toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: /^Jour (précédent|suivant)/ }),
    ).not.toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Calendrier" })).not.toBeOnTheScreen();
  });

  it("closes the sheet", async () => {
    await render(<DayScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("shows today with its actions", async () => {
    mockDate = "2026-10-24";
    await render(<DayScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Samedi 24 octobre" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Prendre la prise de 08:20" })).toBeOnTheScreen();
  });
});
