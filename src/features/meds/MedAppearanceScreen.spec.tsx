import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { getMedById } from "@/features/pillbox/queries/getMedById";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { MedAppearanceScreen } from "./MedAppearanceScreen";

let mockDatabase: Database;
let mockSearchParams: { medId?: string } = {};

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => mockSearchParams,
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

async function renderScreen(): Promise<string> {
  const medId = findMedId(mockDatabase, "Lithium", "250 mg");
  mockSearchParams = { medId };
  await render(<MedAppearanceScreen />, { wrapper });
  return medId;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
});

describe("MedAppearanceScreen", () => {
  it("previews the med with its detail", async () => {
    await renderScreen();

    expect(screen.getByText("Lithium 250 mg", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("Avec le repas", { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it("saves the design directly when validating", async () => {
    const medId = await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Ovale" }));
    await fireEvent.press(screen.getByRole("button", { name: "Valider" }));

    expect(getMedById(mockDatabase, medId)?.design.shape).toBe("oval");
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("changes nothing when cancelling", async () => {
    const medId = await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Ovale" }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(getMedById(mockDatabase, medId)?.design.shape).toBe("round");
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
