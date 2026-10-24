import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { MedQuantity } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";
import type { Database } from "@/shared/database/types";
import { i18n } from "@/shared/i18n/i18n";

import { IntakeDraftProvider, useIntakeDraft } from "./hooks/useIntakeDraft";
import { MedDraftProvider } from "./hooks/useMedDraft";
import { AsNeededMedScreen, IntakeMedScreen } from "./MedScreen";
import { getAllIntakes } from "./queries/getAllIntakes";
import { getAllMeds } from "./queries/getAllMeds";
import { getAsNeededMeds } from "./queries/getAsNeededMeds";
import { getMedById } from "./queries/getMedById";

let mockDatabase: Database;
let mockSearchParams: { medId?: string } = {};
const mockParentNavigation = { goBack: jest.fn() };

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn(), dismissAll: jest.fn(), navigate: jest.fn() },
  useLocalSearchParams: () => mockSearchParams,
  useNavigation: () => ({ getParent: () => mockParentNavigation }),
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

let draftMedQuantities: MedQuantity[] = [];

function DraftSpy() {
  const { draft } = useIntakeDraft();
  useEffect(() => {
    draftMedQuantities = draft.medQuantities;
  });
  return null;
}

function renderIntakeMedScreen() {
  const [noon] = getAllIntakes(mockDatabase).filter(({ time }) => time.hour === 12);
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <IntakeDraftProvider intakeId={noon.id}>
          <MedDraftProvider>
            <DraftSpy />
            {children}
          </MedDraftProvider>
        </IntakeDraftProvider>
      </SafeAreaProvider>
    );
  }
  return render(<IntakeMedScreen />, { wrapper });
}

function renderAsNeededMedScreen() {
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <MedDraftProvider>{children}</MedDraftProvider>
      </SafeAreaProvider>
    );
  }
  return render(<AsNeededMedScreen />, { wrapper });
}

function findMed(name: string) {
  return getAllMeds(mockDatabase).find((med) => med.name === name);
}

async function typeIn(label: string, text: string) {
  await fireEvent.changeText(screen.getByLabelText(label), text);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
  mockSearchParams = {};
});

describe("MedScreen", () => {
  describe("new med from an intake", () => {
    it("creates the med and adds it once to the intake", async () => {
      await renderIntakeMedScreen();

      expect(screen.getByRole("header", { name: "Nouveau médicament" })).toBeOnTheScreen();
      await typeIn("Nom", " Mélatonine ");
      await typeIn("Dosage (facultatif)", "1 mg");
      expect(
        screen.queryByRole("adjustable", { name: "Quantité dans la prise" }),
      ).not.toBeOnTheScreen();
      await fireEvent.press(screen.getByRole("button", { name: "Ajouter à la prise" }));

      const melatonin = findMed("Mélatonine");
      expect(melatonin).toMatchObject({ strength: "1 mg", detail: "", isAsNeeded: false });
      expect(draftMedQuantities).toContainEqual({ med: melatonin, quantity: 1 });
      expect(router.dismissAll).toHaveBeenCalledTimes(1);
    });

    it("goes back to the picker", async () => {
      await renderIntakeMedScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

      expect(router.back).toHaveBeenCalledTimes(1);
    });

    it("opens the appearance screen", async () => {
      await renderIntakeMedScreen();

      await fireEvent.press(
        screen.getByRole("button", {
          name: "Modifier l’apparence de la pilule : rond, moyenne, lilas",
        }),
      );

      expect(router.push).toHaveBeenCalledWith("/intake/appearance");
    });

    it("refuses an empty name", async () => {
      await renderIntakeMedScreen();

      await typeIn("Nom", "  ");
      await fireEvent.press(screen.getByRole("button", { name: "Ajouter à la prise" }));

      expect(screen.getByLabelText("Nom")).toHaveProp(
        "accessibilityHint",
        "Indiquez le nom du médicament.",
      );
      expect(countRows(mockDatabase, medTable)).toBe(6);
      expect(router.dismissAll).not.toHaveBeenCalled();
    });

    it("refuses a duplicate", async () => {
      await renderIntakeMedScreen();

      await typeIn("Nom", "Lithium");
      await typeIn("Dosage (facultatif)", "250 mg");
      await fireEvent.press(screen.getByRole("button", { name: "Ajouter à la prise" }));

      expect(
        screen.getByRole("header", { name: "Votre médicament Lithium 250 mg existe déjà" }),
      ).toBeOnTheScreen();
      expect(countRows(mockDatabase, medTable)).toBe(6);
    });
  });

  describe("existing med from an intake", () => {
    it("updates the med and the intake draft", async () => {
      mockSearchParams = { medId: findMed("Lithium")?.id };
      await renderIntakeMedScreen();

      expect(screen.getByRole("header", { name: "Modifier le médicament" })).toBeOnTheScreen();
      expect(
        screen.queryByRole("adjustable", { name: "Quantité dans la prise" }),
      ).not.toBeOnTheScreen();
      await typeIn("Dosage (facultatif)", "400 mg");
      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      expect(findMed("Lithium")?.strength).toBe("400 mg");
      expect(draftMedQuantities.map(({ med }) => med.strength)).toEqual(["400 mg"]);
      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });

  describe("stock button", () => {
    it("is absent for a new med", async () => {
      await renderIntakeMedScreen();

      expect(screen.queryByRole("button", { name: "Ajouter un stock" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Modifier le stock" })).toBeNull();
    });

    it("adds the stock of a med without stock from the stock tab", async () => {
      const medId = findMed("Quviviq")?.id;
      mockSearchParams = { medId };
      await renderIntakeMedScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Ajouter un stock" }));

      expect(router.navigate).toHaveBeenCalledWith("/stocks");
      expect(router.push).toHaveBeenCalledWith({ pathname: "/stock", params: { medId } });
    });

    it("edits the stock of a followed med", async () => {
      mockSearchParams = { medId: findMed("Lithium")?.id };
      await renderAsNeededMedScreen();

      expect(screen.getByRole("button", { name: "Modifier le stock" })).toBeOnTheScreen();
    });
  });

  describe("new as needed med", () => {
    it("suggests the as needed detail and creates an as needed med", async () => {
      await renderAsNeededMedScreen();

      expect(screen.getByLabelText("Détail (facultatif)")).toHaveProp("value", "Si besoin");
      expect(
        screen.queryByRole("adjustable", { name: "Quantité dans la prise" }),
      ).not.toBeOnTheScreen();
      await typeIn("Nom", "Doliprane");
      await fireEvent.press(screen.getByRole("button", { name: "Ajouter au hors planning" }));

      expect(getAsNeededMeds(mockDatabase).map(({ name }) => name)).toContain("Doliprane");
      expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("existing as needed med", () => {
    function prazepamId(): string {
      return getAsNeededMeds(mockDatabase)[0].id;
    }

    it("refuses to rename it as another med", async () => {
      mockSearchParams = { medId: prazepamId() };
      await renderAsNeededMedScreen();

      await typeIn("Nom", "Lithium");
      await typeIn("Dosage (facultatif)", "250 mg");
      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      expect(
        screen.getByRole("header", { name: "Votre médicament Lithium 250 mg existe déjà" }),
      ).toBeOnTheScreen();
      expect(getMedById(mockDatabase, prazepamId())?.name).toBe("Prazépam");
    });

    it("saves it unchanged without duplicate error", async () => {
      mockSearchParams = { medId: prazepamId() };
      await renderAsNeededMedScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    it("removes it from the as needed meds after confirmation", async () => {
      const medId = prazepamId();
      mockSearchParams = { medId };
      await renderAsNeededMedScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Enlever de « Hors planning »" }));
      await fireEvent.press(screen.getByRole("button", { name: "Enlever" }));

      expect(getMedById(mockDatabase, medId)?.isAsNeeded).toBe(false);
      expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");
    await renderIntakeMedScreen();

    expect(screen.getByRole("header", { name: "New medication" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Add to the intake" })).toBeOnTheScreen();
  });
});
