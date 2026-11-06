import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { renderInEnglish } from "@/shared/i18n/testHelpers";

import { saveStock } from "@/features/stocks/queries/saveStock";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { archiveMed } from "./queries/archiveMed";
import { MedsScreen } from "./MedsScreen";

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

function nameOf(element: { props: { accessibilityLabel?: string } }): string | undefined {
  return element.props.accessibilityLabel;
}

async function renderScreen() {
  jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
  await render(<MedsScreen />, { wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockDatabase = createTestDatabase();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("MedsScreen", () => {
  it("lists every active med alphabetically, with its stock", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Médicaments" })).toBeOnTheScreen();
    expect(screen.getAllByRole("button", { name: / mg, / }).map(nameOf)).toEqual([
      "Lamictal 50 mg, 45 jours, 45 comprimés",
      "Lamictal 100 mg, 56 jours, 56 comprimés",
      "Lithium 250 mg, stock bas, 4 jours, 18 comprimés",
      "Prazépam 25 mg, 15 comprimés",
      "Prégabaline 50 mg, stock non suivi",
      "Quviviq 50 mg, stock non suivi",
    ]);
  });

  it("shows the days with a gauge, the pills alone without schedule, or no stock", async () => {
    await renderScreen();

    expect(screen.getByText("56 cp")).toBeOnTheScreen();
    expect(screen.getAllByText("jours").length).toBeGreaterThan(0);
    expect(screen.getByText("15")).toBeOnTheScreen();
    expect(screen.getAllByText("cp")).toHaveLength(1);
    expect(screen.getAllByText("Non suivi")).toHaveLength(2);
  });

  it("hides the archived meds", async () => {
    archiveMed(mockDatabase, findMedId(mockDatabase, "Prazépam", "25 mg"), new Date());
    await renderScreen();

    expect(screen.queryByRole("button", { name: /^Prazépam/ })).not.toBeOnTheScreen();
  });

  it("marks a low stock without schedule", async () => {
    saveStock(mockDatabase, {
      medId: findMedId(mockDatabase, "Prazépam", "25 mg"),
      quantity: 0,
      boxSize: 20,
      lowStockDays: 7,
    });
    await renderScreen();

    expect(
      screen.getByRole("button", { name: "Prazépam 25 mg, stock bas, 0 comprimé" }),
    ).toBeOnTheScreen();
  });

  it("opens the sheet of a med", async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole("button", { name: /^Lithium 250 mg/ }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/meds/[medId]",
      params: { medId: findMedId(mockDatabase, "Lithium", "250 mg") },
    });
  });

  it("opens a new med from the header and from the bottom of the list", async () => {
    await renderScreen();

    const [headerButton, bottomButton] = screen.getAllByRole("button", {
      name: "Nouveau médicament",
    });
    await fireEvent.press(headerButton);
    await fireEvent.press(bottomButton);

    expect(router.push).toHaveBeenNthCalledWith(1, "/med");
    expect(router.push).toHaveBeenNthCalledWith(2, "/med");
  });

  it("shows the empty state without med", async () => {
    mockDatabase = createTestDatabase({ seed: false });
    await renderScreen();

    expect(
      screen.getByText(
        "Ajoutez vos médicaments : suivez leur stock et prenez-les quand vous voulez.",
      ),
    ).toBeOnTheScreen();
    expect(screen.getAllByRole("button", { name: "Nouveau médicament" })).toHaveLength(2);
    await fireEvent.press(screen.getAllByRole("button", { name: "Nouveau médicament" })[1]);

    expect(router.push).toHaveBeenCalledWith("/med");
  });

  it("is translated in English", async () => {
    jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
    await renderInEnglish(<MedsScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Meds" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Lithium 250 mg, low stock, 4 days, 18 pills" }));
    expect(screen.getAllByRole("button", { name: "New medication" })).toHaveLength(2);
  });
});
