import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { ActionSheetIOS } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { i18n } from "@/shared/i18n/i18n";

import { useSettingsStore } from "@/features/settings/store/settingsStore";

import { IntakeDraftProvider, useIntakeDraft } from "./hooks/useIntakeDraft";
import { IntakeEditScreen } from "./IntakeEditScreen";
import { getAllIntakes } from "./queries/getAllIntakes";
import { getAsNeededMeds } from "./queries/getAsNeededMeds";
import { getIntakeById } from "./queries/getIntakeById";

let mockDatabase: Database;
const mockParentNavigation = { goBack: jest.fn(), setOptions: jest.fn() };
const mockNavigation = { getParent: () => mockParentNavigation, dispatch: jest.fn() };
const mockPreventRemove: {
  isPrevented: boolean;
  callback?: (options: { data: { action: object } }) => void;
} = { isPrevented: false };

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useNavigation: () => mockNavigation,
}));
jest.mock("expo-router/react-navigation", () => ({
  usePreventRemove: (
    isPrevented: boolean,
    callback: (options: { data: { action: object } }) => void,
  ) => {
    mockPreventRemove.isPrevented = isPrevented;
    mockPreventRemove.callback = callback;
  },
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

let draftActions: ReturnType<typeof useIntakeDraft>;

function DraftActionsSpy({ onDraft }: { onDraft: (value: typeof draftActions) => void }) {
  const value = useIntakeDraft();
  useEffect(() => {
    onDraft(value);
  });
  return null;
}

function renderScreen(intakeId?: string) {
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <IntakeDraftProvider intakeId={intakeId}>
          <DraftActionsSpy
            onDraft={(value) => {
              draftActions = value;
            }}
          />
          {children}
        </IntakeDraftProvider>
      </SafeAreaProvider>
    );
  }
  return render(<IntakeEditScreen />, { wrapper });
}

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
  useSettingsStore.setState({ defaultReminderIntervalMinutes: 10 });
});

describe("IntakeEditScreen", () => {
  describe("new intake", () => {
    it("starts at 08:00, every day, reminded every 10 minutes, without med", async () => {
      await renderScreen();

      expect(screen.getByRole("header", { name: "Nouvelle prise" })).toBeOnTheScreen();
      expect(screen.getByTestId("date-picker").props.modifiers).toContainEqual({
        accessibilityLabel: "Heure : 08:00",
      });
      expect(screen.getByRole("radio", { name: "Tous les jours" })).toBeSelected();
      expect(screen.getByRole("button", { name: "Lundi" })).toBeSelected();
      expect(screen.getByRole("radio", { name: "10 minutes" })).toBeSelected();
      expect(screen.queryByRole("button", { name: "Supprimer cette prise" })).not.toBeOnTheScreen();
    });

    it("uses the default reminder interval from the settings", async () => {
      useSettingsStore.setState({ defaultReminderIntervalMinutes: 30 });

      await renderScreen();

      expect(screen.getByRole("radio", { name: "30 minutes" })).toBeSelected();
    });

    it("opens the med picker", async () => {
      await renderScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Ajouter un médicament" }));

      expect(router.push).toHaveBeenCalledWith("/intake/med-picker");
    });

    it("refuses to save without med", async () => {
      await renderScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      expect(screen.getByRole("header", { name: "Il manque un médicament" })).toBeOnTheScreen();
      expect(getAllIntakes(mockDatabase)).toHaveLength(4);
      expect(mockParentNavigation.goBack).not.toHaveBeenCalled();
    });

    it("saves the intake, reschedules the reminders and closes", async () => {
      const [prazepam] = getAsNeededMeds(mockDatabase);
      await renderScreen();
      await act(() => draftActions.addMed(prazepam));

      await fireEvent(screen.getByTestId("date-picker"), "dateChange", timeAt(21, 15));
      await fireEvent.press(screen.getByRole("radio", { name: "15 minutes" }));
      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      const created = getAllIntakes(mockDatabase).find(({ time }) => time.hour === 21);
      expect(created).toMatchObject({
        time: { hour: 21, minute: 15 },
        reminderIntervalMinutes: 15,
        medQuantities: [{ med: prazepam, quantity: 1 }],
      });
      expect(rescheduleReminders).toHaveBeenCalledWith(mockDatabase, expect.any(Date));
      expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("existing intake", () => {
    it("shows the intake time in the title", async () => {
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);

      expect(screen.getByRole("header", { name: "Prise de 08:20" })).toBeOnTheScreen();
    });

    it("keeps its own reminder interval", async () => {
      useSettingsStore.setState({ defaultReminderIntervalMinutes: 30 });
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);

      expect(screen.getByRole("radio", { name: "10 minutes" })).toBeSelected();
    });

    it("updates the quantities and the days in place", async () => {
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);

      await fireEvent.press(
        screen.getByRole("button", { name: "Ajouter un comprimé de Lithium 250 mg" }),
      );
      await fireEvent.press(screen.getByRole("button", { name: "Dimanche" }));
      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      const updated = getIntakeById(mockDatabase, morning.id);
      expect(updated?.days).not.toContain("sunday");
      expect(updated?.days).toHaveLength(6);
      expect(updated?.medQuantities.find(({ med }) => med.name === "Lithium")?.quantity).toBe(2);
    });

    it("removes a med with the trash at quantity 1", async () => {
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);

      await fireEvent.press(
        screen.getByRole("button", { name: "Retirer Lamictal 50 mg de la prise" }),
      );

      expect(screen.queryByText("Lamictal")).not.toBeOnTheScreen();
    });

    it("refuses to save some days without any day", async () => {
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);

      await fireEvent.press(screen.getByRole("radio", { name: "Certains jours" }));
      for (const day of ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]) {
        await fireEvent.press(screen.getByRole("button", { name: day }));
      }
      await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

      expect(screen.getByRole("header", { name: "Il manque un jour" })).toBeOnTheScreen();
    });

    it("archives the intake after confirmation", async () => {
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);

      await fireEvent.press(screen.getByRole("button", { name: "Supprimer cette prise" }));
      expect(screen.getByRole("header", { name: "Supprimer cette prise ?" })).toBeOnTheScreen();
      await fireEvent.press(screen.getByRole("button", { name: "Supprimer" }));

      expect(getIntakeById(mockDatabase, morning.id)).toBeUndefined();
      expect(rescheduleReminders).toHaveBeenCalled();
      expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("unsaved changes", () => {
    it("closes directly without change", async () => {
      await renderScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

      expect(mockPreventRemove.isPrevented).toBe(false);
      expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
      expect(mockParentNavigation.setOptions).toHaveBeenLastCalledWith({ gestureEnabled: true });
    });

    it("blocks the swipe and asks before discarding the changes", async () => {
      await renderScreen();
      await fireEvent.press(screen.getByRole("radio", { name: "30 minutes" }));

      expect(mockPreventRemove.isPrevented).toBe(true);
      expect(mockParentNavigation.setOptions).toHaveBeenLastCalledWith({ gestureEnabled: false });

      const action = { type: "GO_BACK" };
      await act(() => mockPreventRemove.callback?.({ data: { action } }));
      expect(
        screen.getByRole("header", { name: "Abandonner les modifications ?" }),
      ).toBeOnTheScreen();

      await fireEvent.press(screen.getByRole("button", { name: "Abandonner" }));
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(action);
    });

    it("keeps editing with continue", async () => {
      await renderScreen();
      await fireEvent.press(screen.getByRole("radio", { name: "30 minutes" }));
      await act(() => mockPreventRemove.callback?.({ data: { action: { type: "GO_BACK" } } }));

      await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

      expect(
        screen.queryByRole("header", { name: "Abandonner les modifications ?" }),
      ).not.toBeOnTheScreen();
      expect(mockNavigation.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("med row actions", () => {
    const LITHIUM_ROW = "Lithium 250 mg, Avec le repas";

    async function openLithiumActions(chosenButtonIndex: number) {
      const showActionSheet = jest
        .spyOn(ActionSheetIOS, "showActionSheetWithOptions")
        .mockImplementation((_options, callback) => callback(chosenButtonIndex));
      const [morning] = getAllIntakes(mockDatabase);
      await renderScreen(morning.id);
      await fireEvent.press(screen.getByRole("button", { name: LITHIUM_ROW }));
      return showActionSheet;
    }

    it("shows the actions of the med", async () => {
      const showActionSheet = await openLithiumActions(2);

      expect(showActionSheet).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Lithium 250 mg",
          options: ["Modifier le médicament", "Retirer de la prise", "Annuler"],
          cancelButtonIndex: 2,
        }),
        expect.any(Function),
      );
      expect(screen.getByRole("button", { name: LITHIUM_ROW })).toBeOnTheScreen();
    });

    it("opens the med screen", async () => {
      const lithiumId = getAllIntakes(mockDatabase)[0].medQuantities.find(
        ({ med }) => med.name === "Lithium",
      )?.med.id;

      await openLithiumActions(0);

      expect(router.push).toHaveBeenCalledWith({
        pathname: "/intake/med",
        params: { medId: lithiumId },
      });
    });

    it("removes the med from the intake", async () => {
      await openLithiumActions(1);

      expect(screen.queryByRole("button", { name: LITHIUM_ROW })).not.toBeOnTheScreen();
      expect(screen.getByRole("button", { name: "Lamictal 50 mg" })).toBeOnTheScreen();
    });
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");
    await renderScreen();

    expect(screen.getByRole("header", { name: "New intake" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Days" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Repeat the reminder every" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Save" })).toBeOnTheScreen();
  });
});

function timeAt(hour: number, minute: number): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}
