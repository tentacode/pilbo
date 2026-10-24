import { fireEvent, render, screen, within } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { findMedId } from "./queries/testStocks";
import { saveStock } from "./queries/saveStock";
import { StocksScreen } from "./StocksScreen";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    router: { push: jest.fn() },
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
  };
});

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

async function renderMondayMorning() {
  jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
  await render(<StocksScreen />, { wrapper });
}

describe("StocksScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the empty state and the add button without stock", async () => {
    mockDatabase = createTestDatabase({ seed: false });

    await renderMondayMorning();

    expect(screen.getByRole("header", { name: "Aucun médicament suivi" })).toBeOnTheScreen();
    expect(
      screen.getByText(
        "Suivez le stock d’un médicament : Pilbo vous préviendra avant que vous en manquiez.",
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Stock d’un médicament" })).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Suffisant" })).not.toBeOnTheScreen();
  });

  it("lists the low stocks then the sufficient ones, sorted by days left", async () => {
    mockDatabase = createTestDatabase();

    await renderMondayMorning();

    expect(screen.queryByRole("header", { name: "Aucun médicament suivi" })).not.toBeOnTheScreen();
    expect(
      screen.getAllByRole("button").map((button) => button.props.accessibilityLabel as string),
    ).toEqual([
      "Lithium 250 mg, 18 comprimés, 4 jours, Stock bas jusqu’au 22 octobre",
      "Lamictal 50 mg, 45 comprimés, 45 jours, Stock suffisant",
      "Lamictal 100 mg, 56 comprimés, 56 jours, Stock suffisant",
      "Stock d’un médicament",
    ]);
    expect(screen.getByRole("header", { name: "Stock bas" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Suffisant" })).toBeOnTheScreen();
    expect(screen.getByText("Stock bas · jusqu’au 22 octobre")).toBeOnTheScreen();
  });

  it("shows the meds without schedule and the stocks below zero", async () => {
    mockDatabase = createTestDatabase();
    saveStock(mockDatabase, {
      medId: findMedId(mockDatabase, "Prazépam", "25 mg"),
      quantity: -1,
      boxSize: 30,
      lowStockDays: 7,
    });
    saveStock(mockDatabase, {
      medId: findMedId(mockDatabase, "Lithium", "250 mg"),
      quantity: 12,
      boxSize: 30,
      lowStockDays: 7,
    });
    await renderMondayMorning();

    const prazepam = screen.getByRole("button", { name: /^Prazépam 25 mg/ });

    expect(prazepam.props.accessibilityLabel).toBe(
      "Prazépam 25 mg, -1 comprimé, Si besoin, Stock bas à renouveler",
    );
    expect(within(prazepam).getByText("Si besoin")).toBeOnTheScreen();
    expect(within(prazepam).getByText("Stock bas · à renouveler")).toBeOnTheScreen();
  });

  it("opens the med picker and the stock of a med", async () => {
    mockDatabase = createTestDatabase();
    await renderMondayMorning();

    await fireEvent.press(screen.getByRole("button", { name: "Stock d’un médicament" }));
    expect(router.push).toHaveBeenCalledWith("/stock/med-picker");

    await fireEvent.press(screen.getByRole("button", { name: /^Lithium 250 mg/ }));
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/stock",
      params: { medId: findMedId(mockDatabase, "Lithium", "250 mg") },
    });
  });
});
