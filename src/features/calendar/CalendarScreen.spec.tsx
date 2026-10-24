import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { router } from "expo-router";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { CalendarScreen } from "./CalendarScreen";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    router: { back: jest.fn(), push: jest.fn() },
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
  };
});

const NOW = new Date(2026, 9, 24, 9, 0);

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("CalendarScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    jest.clearAllMocks();
    mockDatabase = createTestDatabase({ withLogs: true, now: NOW });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the current month with the status of each day", async () => {
    await render(<CalendarScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Calendrier" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Octobre 2026" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "23 octobre : pris" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "21 octobre : pris en retard" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "18 octobre : ignoré" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "15 octobre : non pris" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "24 octobre, aujourd'hui : pris en retard" }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: "25 octobre" })).toBeDisabled();
    expect(screen.getByText("En retard")).toBeOnTheScreen();
  });

  it("does not go after the current month", async () => {
    await render(<CalendarScreen />, { wrapper });

    expect(screen.getByRole("button", { name: "Mois suivant : novembre" })).toBeDisabled();
  });

  it("goes to the previous month until the first day of history", async () => {
    await render(<CalendarScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Mois précédent : septembre" }));

    expect(screen.getByRole("header", { name: "Septembre 2026" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "8 septembre" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "9 septembre : pris" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Mois précédent : août" })).toBeDisabled();

    await fireEvent.press(screen.getByRole("button", { name: "Mois suivant : octobre" }));

    expect(screen.getByRole("header", { name: "Octobre 2026" })).toBeOnTheScreen();
  });

  it("opens a day", async () => {
    await render(<CalendarScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "21 octobre : pris en retard" }));

    expect(router.push).toHaveBeenCalledWith("/day/2026-10-21");
  });

  it("goes back to today", async () => {
    await render(<CalendarScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Aujourd'hui" }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
