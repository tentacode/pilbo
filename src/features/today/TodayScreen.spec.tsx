import { fireEvent, render, screen } from "@testing-library/react-native";
import { sql } from "drizzle-orm";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as Haptics from "expo-haptics";

import { insertMed } from "@/features/pillbox/queries/insertMed";
import { intakeLogTable, intakeTable, medLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";
import type { Database } from "@/shared/database/types";

import { TodayScreen } from "./TodayScreen";

let mockDatabase: Database;
let mockPermissionGranted = true;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/notifications", () => ({
  getPermissionStatus: () => Promise.resolve(mockPermissionGranted ? "granted" : "denied"),
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
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

function logIntakes(hours: number[], status: "taken" | "skipped") {
  const intakes = mockDatabase.all<{ id: string; hour: number; minute: number }>(sql`
    SELECT ${intakeTable.id} AS id, ${intakeTable.hour} AS hour, ${intakeTable.minute} AS minute
    FROM ${intakeTable}
  `);
  for (const { id, hour, minute } of intakes.filter(({ hour }) => hours.includes(hour))) {
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    mockDatabase
      .insert(intakeLogTable)
      .values({
        intakeId: id,
        expectedIntakeAt: `2026-10-04T${time}`,
        createdAt: `2026-10-04T${time}`,
        status,
      })
      .run();
  }
}

async function renderAt(hour: number, minute: number) {
  jest.setSystemTime(new Date(2026, 9, 4, hour, minute));
  await render(<TodayScreen />, { wrapper });
}

describe("TodayScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockDatabase = createTestDatabase();
    mockPermissionGranted = true;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the next intake then the later ones", async () => {
    await renderAt(7, 0);

    expect(screen.getByRole("header", { name: "Aujourd'hui" })).toBeOnTheScreen();
    expect(screen.getByText("Dimanche 4 octobre")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Prochaine prise" })).toBeOnTheScreen();
    expect(screen.getByLabelText("08:20, Dans 1 heure 20 minutes")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Plus tard" })).toBeOnTheScreen();
    expect(screen.getByLabelText("12:20, À venir")).toBeOnTheScreen();
    expect(screen.getByLabelText("20:20, À venir")).toBeOnTheScreen();
    expect(screen.getByLabelText("22:00, À venir")).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Ensuite" })).not.toBeOnTheScreen();
  });

  it("shows a single late intake without a section title", async () => {
    await renderAt(9, 30);

    expect(screen.getByLabelText("08:20, En retard de 1 heure 10 minutes")).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: /en retard/ })).not.toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Ensuite" })).toBeOnTheScreen();
    expect(screen.getByLabelText("12:20, Dans 2 heures 50 minutes")).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Prochaine prise" })).not.toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Plus tard" })).not.toBeOnTheScreen();
  });

  it("groups several late intakes under a title", async () => {
    await renderAt(13, 30);

    expect(screen.getByRole("header", { name: "2 prises en retard" })).toBeOnTheScreen();
    expect(screen.getByLabelText("08:20, En retard de 5 heures 10 minutes")).toBeOnTheScreen();
    expect(screen.getByLabelText("12:20, En retard de 1 heure 10 minutes")).toBeOnTheScreen();
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
    expect(screen.queryByRole("button", { name: /Si besoin|au besoin/ })).not.toBeOnTheScreen();
    expect(screen.getByText("Une journée tranquille côté pilulier.")).toBeOnTheScreen();
  });

  it("shows the upcoming intake in the empty state", async () => {
    mockDatabase
      .update(intakeTable)
      .set({ days: ["tuesday"] })
      .run();
    await renderAt(7, 0);

    expect(
      screen.getByText("Une journée tranquille côté pilulier. Prochaine prise mardi à 08:20."),
    ).toBeOnTheScreen();
  });

  describe("as needed meds", () => {
    const TAKE_PRAZEPAM = "Prendre Prazépam 25 mg";
    const CANCEL_PRAZEPAM = "Annuler les prises de Prazépam 25 mg aujourd’hui";

    it("lists the as needed meds at the bottom", async () => {
      await renderAt(7, 0);

      expect(screen.getByRole("header", { name: "Hors planning" })).toBeOnTheScreen();
      expect(screen.getByLabelText("Prazépam 25 mg, Si besoin")).toBeOnTheScreen();
      expect(screen.queryByRole("button", { name: CANCEL_PRAZEPAM })).not.toBeOnTheScreen();
    });

    it("shows the as needed meds even without intakes", async () => {
      mockDatabase = createTestDatabase({ seed: false });
      insertMed(mockDatabase, {
        name: "Doliprane",
        strength: "1 g",
        detail: "Si besoin",
        design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
        isAsNeeded: true,
      });
      await renderAt(7, 0);

      expect(screen.getByRole("header", { name: "Rien à prendre aujourd'hui" })).toBeOnTheScreen();
      expect(screen.getByRole("button", { name: "Prendre Doliprane 1 g" })).toBeOnTheScreen();
    });

    it("takes an as needed med and shows the time of the last intake", async () => {
      await renderAt(7, 0);

      await fireEvent.press(screen.getByRole("button", { name: TAKE_PRAZEPAM }));
      jest.setSystemTime(new Date(2026, 9, 4, 9, 30));
      await fireEvent.press(screen.getByRole("button", { name: TAKE_PRAZEPAM }));

      expect(screen.getByText("Pris à 09:30")).toBeOnTheScreen();
      expect(countRows(mockDatabase, medLogTable)).toBe(2);
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success,
      );
    });

    it("cancels every intake of the day of the med", async () => {
      await renderAt(7, 0);
      await fireEvent.press(screen.getByRole("button", { name: TAKE_PRAZEPAM }));
      await fireEvent.press(screen.getByRole("button", { name: TAKE_PRAZEPAM }));

      await fireEvent.press(screen.getByRole("button", { name: CANCEL_PRAZEPAM }));

      expect(screen.queryByText(/^Pris à/)).not.toBeOnTheScreen();
      expect(countRows(mockDatabase, medLogTable)).toBe(0);
    });
  });

  it("shows the handled intakes in the earlier section", async () => {
    logIntakes([8], "taken");
    logIntakes([12], "skipped");
    await renderAt(13, 0);

    expect(screen.getByRole("header", { name: "Déjà prise" })).toBeOnTheScreen();
    expect(screen.getByText("Pris à 08:20")).toBeOnTheScreen();
    expect(screen.getByText("Ignorée")).toBeOnTheScreen();
    expect(screen.queryByText(/en retard/)).not.toBeOnTheScreen();
  });

  it("shows the done state above the earlier section when everything is handled", async () => {
    logIntakes([8, 12, 20, 22], "taken");
    await renderAt(23, 0);

    expect(screen.getByRole("header", { name: "C'est tout pour aujourd'hui" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Déjà prise" })).toBeOnTheScreen();
    expect(screen.queryByRole("header", { name: "Prochaine prise" })).not.toBeOnTheScreen();
  });

  it("moves a taken intake to the earlier section", async () => {
    await renderAt(21, 0);

    await fireEvent.press(screen.getByRole("button", { name: "Prendre la prise de 22:00" }));

    expect(screen.getByRole("header", { name: "Déjà prise" })).toBeOnTheScreen();
    expect(screen.getByText("Pris à 21:00")).toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: "Prendre la prise de 22:00" }),
    ).not.toBeOnTheScreen();
  });

  it("shows the disabled reminders notice without the notification permission", async () => {
    mockPermissionGranted = false;
    await renderAt(7, 0);

    expect(
      await screen.findByRole("header", { name: "Les rappels sont désactivés" }),
    ).toBeOnTheScreen();
  });

  it("hides the notice with the notification permission", async () => {
    await renderAt(7, 0);

    expect(
      screen.queryByRole("header", { name: "Les rappels sont désactivés" }),
    ).not.toBeOnTheScreen();
  });
});
