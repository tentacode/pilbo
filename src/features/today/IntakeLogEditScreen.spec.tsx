import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { fromLocalDate } from "@/domain/intakeLog";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { formatIntakeTime } from "@/shared/i18n/formatters";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { getIntakeLogsOfDay } from "./queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "./queries/getIntakesOfDay";
import { insertIntakeLog } from "./queries/insertIntakeLog";
import { IntakeLogEditScreen } from "./IntakeLogEditScreen";

const LOCAL_DATE = "2026-10-14";

let mockDatabase: Database;
let mockSearchParams: { intakeId?: string; date?: string } = {};
const mockParentNavigation = { goBack: jest.fn(), setOptions: jest.fn() };
const mockNavigation = { getParent: () => mockParentNavigation, dispatch: jest.fn() };

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
  useNavigation: () => mockNavigation,
}));
jest.mock("expo-router/react-navigation", () => ({
  usePreventRemove: jest.fn(),
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

function firstIntake() {
  return getIntakesOfDay(mockDatabase, fromLocalDate(LOCAL_DATE))[0];
}

async function renderScreen() {
  const intake = firstIntake();
  mockSearchParams = { intakeId: intake.id, date: LOCAL_DATE };
  await render(<IntakeLogEditScreen />, { wrapper });
  return intake;
}

function timeAt(hour: number, minute: number): Date {
  return new Date(2026, 9, 14, hour, minute);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
});

describe("IntakeLogEditScreen", () => {
  it("shows a missed intake with its meds, without taken time", async () => {
    const intake = await renderScreen();

    expect(
      screen.getByRole("header", { name: `Prise de ${formatIntakeTime(intake.time)}` }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Mercredi 14 octobre")).toBeOnTheScreen();
    expect(screen.getByRole("radio", { name: "Supprimer" })).toBeSelected();
    expect(screen.queryByTestId("date-picker")).not.toBeOnTheScreen();
  });

  it("logs a missed intake as taken at the chosen time", async () => {
    const intake = await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Prise" }));
    expect(screen.getByTestId("date-picker").props.modifiers).toContainEqual({
      accessibilityLabel: `Heure de prise : ${formatIntakeTime(intake.time)}`,
    });
    await fireEvent(screen.getByTestId("date-picker"), "dateChange", timeAt(10, 45));
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(getIntakeLogsOfDay(mockDatabase, LOCAL_DATE)).toEqual([
      expect.objectContaining({
        intakeId: intake.id,
        status: "taken",
        createdAt: `${LOCAL_DATE}T10:45`,
      }),
    ]);
    expect(rescheduleReminders).toHaveBeenCalled();
    expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it("starts on the recorded status and time, and cancels a taken intake", async () => {
    const intake = firstIntake();
    insertIntakeLog(mockDatabase, {
      intakeId: intake.id,
      status: "taken",
      expectedIntakeAt: `${LOCAL_DATE}T08:00`,
      createdAt: `${LOCAL_DATE}T09:25`,
    });
    await renderScreen();

    expect(screen.getByRole("radio", { name: "Prise" })).toBeSelected();
    expect(screen.getByTestId("date-picker").props.modifiers).toContainEqual({
      accessibilityLabel: `Heure de prise : ${formatIntakeTime({ hour: 9, minute: 25 })}`,
    });

    await fireEvent.press(screen.getByRole("radio", { name: "Supprimer" }));
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(getIntakeLogsOfDay(mockDatabase, LOCAL_DATE)).toEqual([]);
  });

  it("closes without saving", async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Ignorée" }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    expect(getIntakeLogsOfDay(mockDatabase, LOCAL_DATE)).toEqual([]);
  });
});
