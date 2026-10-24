import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { i18n } from "@/shared/i18n/i18n";

import { IntakeDraftProvider, useIntakeDraft } from "./hooks/useIntakeDraft";
import { AsNeededMedPickerScreen, IntakeMedPickerScreen } from "./MedPickerScreen";
import { getAllIntakes } from "./queries/getAllIntakes";
import { getAsNeededMeds } from "./queries/getAsNeededMeds";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect: useReactEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    router: { push: jest.fn(), back: jest.fn() },
    useFocusEffect: (effect: () => void) => useReactEffect(effect, [effect]),
  };
});

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

let draftMedNames: string[] = [];

function DraftMedNamesSpy() {
  const { draft } = useIntakeDraft();
  useEffect(() => {
    draftMedNames = draft.medQuantities.map(({ med }) => med.name);
  });
  return null;
}

function renderIntakePicker() {
  const [morning] = getAllIntakes(mockDatabase);
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <IntakeDraftProvider intakeId={morning.id}>
          <DraftMedNamesSpy />
          {children}
        </IntakeDraftProvider>
      </SafeAreaProvider>
    );
  }
  return render(<IntakeMedPickerScreen />, { wrapper });
}

function renderAsNeededPicker() {
  function wrapper({ children }: { children: ReactNode }) {
    return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
  }
  return render(<AsNeededMedPickerScreen />, { wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
});

describe("MedPickerScreen", () => {
  describe("from an intake", () => {
    it("lists every med alphabetically", async () => {
      await renderIntakePicker();

      expect(screen.getAllByRole("button", { name: /mg/ }).map(nameOf)).toEqual([
        "Lamictal 50 mg, Dans la prise",
        "Ajouter Lamictal 100 mg",
        "Lithium 250 mg, Avec le repas, Dans la prise",
        "Ajouter Prazépam 25 mg, Si besoin",
        "Ajouter Prégabaline 50 mg",
        "Ajouter Quviviq 50 mg",
      ]);
    });

    it("disables the meds already in the intake", async () => {
      await renderIntakePicker();

      expect(
        screen.getByRole("button", { name: "Lithium 250 mg, Avec le repas, Dans la prise" }),
      ).toBeDisabled();
    });

    it("adds the selected med to the intake and goes back", async () => {
      await renderIntakePicker();

      await fireEvent.press(screen.getByRole("button", { name: "Ajouter Lamictal 100 mg" }));

      expect([...draftMedNames].sort()).toEqual(["Lamictal", "Lamictal", "Lithium"]);
      expect(router.back).toHaveBeenCalledTimes(1);
    });

    it("opens the new med screen", async () => {
      await renderIntakePicker();

      await fireEvent.press(screen.getByRole("button", { name: "Nouveau médicament" }));

      expect(router.push).toHaveBeenCalledWith("/intake/med");
    });
  });

  describe("from the as needed meds", () => {
    it("disables the meds already as needed", async () => {
      await renderAsNeededPicker();

      expect(
        screen.getByRole("button", { name: "Prazépam 25 mg, Si besoin, Déjà hors planning" }),
      ).toBeDisabled();
    });

    it("marks the selected med as needed and closes", async () => {
      await renderAsNeededPicker();

      await fireEvent.press(
        screen.getByRole("button", { name: "Ajouter Lithium 250 mg, Avec le repas" }),
      );

      expect(getAsNeededMeds(mockDatabase).map(({ name }) => name)).toEqual([
        "Lithium",
        "Prazépam",
      ]);
      expect(router.back).toHaveBeenCalledTimes(1);
    });

    it("opens the new med screen", async () => {
      await renderAsNeededPicker();

      await fireEvent.press(screen.getByRole("button", { name: "Nouveau médicament" }));

      expect(router.push).toHaveBeenCalledWith("/as-needed/med");
    });
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");
    await renderIntakePicker();

    expect(screen.getByRole("header", { name: "Add a medication" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "New medication" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Your medications" })).toBeOnTheScreen();
  });
});

function nameOf(element: { props: { accessibilityLabel?: string } }): string | undefined {
  return element.props.accessibilityLabel;
}
