import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { PillboxScreen } from "./PillboxScreen";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return { useFocusEffect: (effect: () => void) => useEffect(effect, [effect]) };
});

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("PillboxScreen", () => {
  it("shows the empty state when there is no intake and no unscheduled med", async () => {
    mockDatabase = createTestDatabase({ seed: false });

    await render(<PillboxScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Votre pilulier est vide" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Créer une prise" })).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Ajouter un médicament hors planning" }),
    ).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Si besoin" })).not.toBeOnTheScreen();
  });

  it("shows the intakes when the pillbox is not empty", async () => {
    mockDatabase = createTestDatabase();

    await render(<PillboxScreen />, { wrapper });

    expect(screen.queryByRole("header", { name: "Votre pilulier est vide" })).not.toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Si besoin" })).toBeOnTheScreen();
  });
});
