import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { findMedId } from "./queries/testStocks";
import { StockMedPickerScreen } from "./StockMedPickerScreen";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    router: { push: jest.fn(), back: jest.fn(), navigate: jest.fn() },
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

describe("StockMedPickerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists every med, the followed ones still selectable", async () => {
    mockDatabase = createTestDatabase();
    await render(<StockMedPickerScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Stock d’un médicament" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Nouveau médicament" })).toBeNull();
    const lithium = screen.getByRole("button", {
      name: "Lithium 250 mg, Avec le repas, En stock",
    });
    expect(lithium).toBeEnabled();
    expect(screen.getByRole("button", { name: "Quviviq 50 mg" })).toBeEnabled();

    await fireEvent.press(lithium);

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/stock",
      params: { medId: findMedId(mockDatabase, "Lithium", "250 mg") },
    });
  });

  it("suggests to open the pillbox without med", async () => {
    mockDatabase = createTestDatabase({ seed: false });
    await render(<StockMedPickerScreen />, { wrapper });

    expect(screen.getByText("Ajoutez d’abord un médicament dans le pilulier.")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir le pilulier" }));

    expect(router.navigate).toHaveBeenCalledWith("/pillbox");
  });
});
