import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { i18n } from "@/shared/i18n/i18n";

import { useSettingsStore } from "@/features/settings/store/settingsStore";

import { IntakeDraftProvider, useIntakeDraft } from "./hooks/useIntakeDraft";
import { IntakeRecurrenceScreen } from "./IntakeRecurrenceScreen";
import { getAllIntakes } from "./queries/getAllIntakes";

const MONDAY = new Date(2026, 10, 2, 9, 0);

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

let draftActions: ReturnType<typeof useIntakeDraft>;

function DraftActionsSpy() {
  const value = useIntakeDraft();
  useEffect(() => {
    draftActions = value;
  });
  return null;
}

async function renderScreen(intakeId?: string) {
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <IntakeDraftProvider intakeId={intakeId}>
          <DraftActionsSpy />
          {children}
        </IntakeDraftProvider>
      </SafeAreaProvider>
    );
  }
  await render(<IntakeRecurrenceScreen />, { wrapper });
  await act(() => draftActions.setDayMode("custom"));
}

function summary() {
  return screen.getByRole("summary");
}

describe("IntakeRecurrenceScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MONDAY);
    jest.clearAllMocks();
    mockDatabase = createTestDatabase();
    useSettingsStore.setState({ defaultReminderIntervalMinutes: 10, defaultReminderSound: "beep" });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with every day, without start date", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Quand prendre mes médicaments" })).toBeOnTheScreen();
    expect(summary().props.accessibilityLabel).toBe("Tous les jours");
    expect(screen.getByRole("radio", { name: "Jour" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Lundi" })).toBeSelected();
    expect(screen.queryByRole("button", { name: /^Date de début/ })).not.toBeOnTheScreen();
  });

  it("chooses the days in day rhythm", async () => {
    await renderScreen();

    for (const day of ["Mardi", "Jeudi", "Samedi", "Dimanche"]) {
      await fireEvent.press(screen.getByRole("button", { name: day }));
    }

    expect(summary().props.accessibilityLabel).toBe("Lundi, mercredi et vendredi");
  });

  it("chooses one week out of N, with a preview", async () => {
    await renderScreen();
    await act(() => draftActions.setStartsOn("2026-11-04"));
    for (const day of ["Mardi", "Jeudi", "Samedi", "Dimanche"]) {
      await fireEvent.press(screen.getByRole("button", { name: day }));
    }

    await fireEvent.press(screen.getByRole("radio", { name: "Semaine" }));

    expect(screen.getByRole("radio", { name: "Une semaine sur deux" })).toBeSelected();
    expect(summary().props.accessibilityLabel).toBe(
      "Lundi, mercredi et vendredi, une semaine sur deux. À partir du mercredi 4 novembre",
    );
    expect(screen.getByText("Les semaines se comptent à partir de cette date.")).toBeOnTheScreen();
    expect(
      screen.getByLabelText(
        "Aperçu : Semaine du 2 novembre : mercredi et vendredi. Semaine du 9 novembre : pause. " +
          "Semaine du 16 novembre : lundi, mercredi et vendredi. Semaine du 23 novembre : pause",
      ),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Une semaine sur trois" }));
    expect(draftActions.draft).toMatchObject({ frequency: "weekly", interval: 3 });
  });

  it("chooses a monthly rhythm, with the next intakes", async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Mois" }));

    expect(screen.queryByRole("button", { name: "Lundi" })).not.toBeOnTheScreen();
    expect(screen.getByRole("radio", { name: "Tous les mois" })).toBeSelected();
    expect(summary().props.accessibilityLabel).toBe(
      "Le 2 de chaque mois. À partir d'aujourd'hui, lundi 2 novembre",
    );
    expect(screen.getByText("Puis le 2 de chaque mois.")).toBeOnTheScreen();
    expect(screen.getByText("Aujourd'hui")).toBeOnTheScreen();
    for (const date of [
      "Lundi 2 novembre",
      "Mercredi 2 décembre",
      "Samedi 2 janvier 2027",
      "Mardi 2 février 2027",
    ]) {
      expect(screen.getByText(date)).toBeOnTheScreen();
    }

    await fireEvent.press(screen.getByRole("radio", { name: "Un mois sur six" }));
    expect(summary().props.accessibilityLabel).toBe(
      "Le 2, un mois sur six. À partir d'aujourd'hui, lundi 2 novembre",
    );
  });

  it("chooses the start date in the calendar", async () => {
    await renderScreen();
    await fireEvent.press(screen.getByRole("radio", { name: "Mois" }));
    const dateButton = screen.getByRole("button", {
      name: "Date de début : aujourd'hui, lundi 2 novembre",
    });

    await fireEvent.press(dateButton);

    expect(dateButton).toBeExpanded();
    expect(screen.getByRole("button", { name: "Dimanche 1er novembre" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Aujourd'hui, Lundi 2 novembre" })).toBeSelected();
    expect(
      screen.getByText(
        "Puis le 2 de chaque mois. Le 29, 30 ou 31 : les mois plus courts, ce sera le dernier jour du mois.",
      ),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Mois suivant : décembre" }));
    await fireEvent.press(screen.getByRole("button", { name: "Jeudi 31 décembre" }));

    expect(screen.getByRole("button", { name: "Jeudi 31 décembre" })).toBeSelected();
    expect(summary().props.accessibilityLabel).toBe(
      "Le 31 de chaque mois. À partir du jeudi 31 décembre",
    );
    expect(draftActions.draft.startsOn).toBe("2026-12-31");
  });

  it("starts again today when going back to the day rhythm", async () => {
    await renderScreen();
    await fireEvent.press(screen.getByRole("radio", { name: "Semaine" }));
    await act(() => draftActions.setStartsOn("2026-11-16"));

    await fireEvent.press(screen.getByRole("radio", { name: "Jour" }));

    expect(draftActions.draft.startsOn).toBe("2026-11-02");
  });

  it("goes back to the intake, keeping the choices in the draft", async () => {
    const [morning] = getAllIntakes(mockDatabase);
    await renderScreen(morning.id);
    await fireEvent.press(screen.getByRole("radio", { name: "Semaine" }));

    await fireEvent.press(screen.getByRole("button", { name: "Prise de 08:20" }));

    expect(router.back).toHaveBeenCalled();
    expect(draftActions.draft).toMatchObject({ dayMode: "custom", frequency: "weekly" });
  });

  it("keeps the past start date of a saved intake", async () => {
    const [morning] = getAllIntakes(mockDatabase);
    await renderScreen(morning.id);
    await fireEvent.press(screen.getByRole("radio", { name: "Semaine" }));

    expect(summary().props.accessibilityLabel).toBe(
      "Tous les jours, une semaine sur deux. À partir du lundi 17 novembre 2025",
    );
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");
    await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Month" }));

    expect(summary().props.accessibilityLabel).toBe(
      "On the 2nd of every month. Starting today, Monday, November 2",
    );
    expect(screen.getByRole("radio", { name: "Every other month" })).toBeOnTheScreen();
  });
});
