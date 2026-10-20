import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { PillboxScreen } from "./PillboxScreen";
import { getAllIntakes } from "./queries/getAllIntakes";
import { getAsNeededMeds } from "./queries/getAsNeededMeds";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
    router: { push: jest.fn() },
  };
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
    expect(screen.queryByRole("header", { name: "Hors planning" })).not.toBeOnTheScreen();
  });

  it("opens a new intake from the empty state", async () => {
    mockDatabase = createTestDatabase({ seed: false });
    await render(<PillboxScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Créer une prise" }));

    expect(router.push).toHaveBeenCalledWith("/intake");
  });

  it("opens the med picker from the empty state", async () => {
    mockDatabase = createTestDatabase({ seed: false });
    await render(<PillboxScreen />, { wrapper });

    await fireEvent.press(
      screen.getByRole("button", { name: "Ajouter un médicament hors planning" }),
    );

    expect(router.push).toHaveBeenCalledWith("/as-needed/med-picker");
  });

  it("shows the intakes when the pillbox is not empty", async () => {
    mockDatabase = createTestDatabase();

    await render(<PillboxScreen />, { wrapper });

    expect(screen.queryByRole("header", { name: "Votre pilulier est vide" })).not.toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Hors planning" })).toBeOnTheScreen();
  });

  it("opens a new intake from the header", async () => {
    mockDatabase = createTestDatabase();
    await render(<PillboxScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Nouvelle prise" }));

    expect(router.push).toHaveBeenCalledWith("/intake");
  });

  it("opens an intake with its identifier", async () => {
    mockDatabase = createTestDatabase();
    const [morning] = getAllIntakes(mockDatabase);
    await render(<PillboxScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: /^8 h 20/ }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/intake",
      params: { intakeId: morning.id },
    });
  });

  it("opens an as needed med and the med picker from the unscheduled section", async () => {
    mockDatabase = createTestDatabase();
    const [prazepam] = getAsNeededMeds(mockDatabase);
    await render(<PillboxScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Prazépam 25 mg, Si besoin" }));
    await fireEvent.press(screen.getByRole("button", { name: "Ajouter un médicament" }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/as-needed/med",
      params: { medId: prazepam.id },
    });
    expect(router.push).toHaveBeenCalledWith("/as-needed/med-picker");
  });
});
