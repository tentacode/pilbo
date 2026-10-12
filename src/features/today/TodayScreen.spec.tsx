import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { TodayScreen } from "./TodayScreen";

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

async function renderAt(hour: number, minute: number) {
  jest.setSystemTime(new Date(2026, 9, 4, hour, minute));
  await render(<TodayScreen />, { wrapper });
}

describe("TodayScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockDatabase = createTestDatabase();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the next intake then the later ones", async () => {
    await renderAt(7, 0);

    expect(screen.getByRole("header", { name: "Aujourd'hui" })).toBeOnTheScreen();
    expect(screen.getByText("Dimanche 4 octobre")).toBeOnTheScreen();
    expect(screen.getByLabelText("0 prise sur 4, prochaine à 08:20")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Prochaine prise" })).toBeOnTheScreen();
    expect(screen.getByLabelText("08:20, Dans 1 heure 20 minutes")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Plus tard" })).toBeOnTheScreen();
    expect(screen.getByLabelText("12:20, À venir")).toBeOnTheScreen();
    expect(screen.getByLabelText("20:20, À venir")).toBeOnTheScreen();
    expect(screen.getByLabelText("22:00, À venir")).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Ensuite" })).not.toBeOnTheScreen();
  });

  it("shows a single late intake without a section title", async () => {
    await renderAt(9, 0);

    expect(screen.getByLabelText("0 prise sur 4, 1 en retard")).toBeOnTheScreen();
    expect(screen.getByLabelText("08:20, En retard de 40 minutes")).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: /en retard/ })).not.toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Ensuite" })).toBeOnTheScreen();
    expect(screen.getByLabelText("12:20, Dans 3 heures 20 minutes")).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Prochaine prise" })).not.toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Plus tard" })).not.toBeOnTheScreen();
  });

  it("groups several late intakes under a title", async () => {
    await renderAt(13, 0);

    expect(screen.getByRole("header", { name: "2 prises en retard" })).toBeOnTheScreen();
    expect(screen.getByLabelText("08:20, En retard de 4 heures 40 minutes")).toBeOnTheScreen();
    expect(screen.getByLabelText("12:20, En retard de 40 minutes")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Ensuite" })).toBeOnTheScreen();
  });

  it("shows only the late intakes when every intake is late", async () => {
    await renderAt(23, 45);

    expect(screen.getByRole("header", { name: "4 prises en retard" })).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Ensuite" })).not.toBeOnTheScreen();
  });

  it("shows the empty state without intakes", async () => {
    mockDatabase = createTestDatabase({ seed: false });
    await renderAt(7, 0);

    expect(screen.getByRole("header", { name: "Rien à prendre aujourd'hui" })).toBeOnTheScreen();
    expect(screen.queryByText(/prise sur/)).not.toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Ajouter une prise hors planning" }),
    ).toBeOnTheScreen();
  });
});
