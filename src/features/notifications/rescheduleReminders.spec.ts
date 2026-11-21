import { toLocalDate } from "@/domain/intakeLog";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { insertMed } from "@/features/pillbox/queries/insertMed";
import { type IntakeToSave, saveIntake } from "@/features/pillbox/queries/saveIntake";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { saveStock } from "@/features/stocks/queries/saveStock";
import { setUpNotificationChannels } from "./notificationChannels";
import { getPermissionGranted, resetReminders } from "./notifications";
import { rescheduleReminders } from "./rescheduleReminders";

jest.mock("./notifications", () => ({
  getPermissionGranted: jest.fn(),
  resetReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("./reminderActionCategory", () => ({
  registerReminderActions: jest.fn(() => Promise.resolve()),
}));
jest.mock("./notificationChannels", () => ({
  setUpNotificationChannels: jest.fn(() => Promise.resolve()),
}));

const initialSettings = useSettingsStore.getState();

const NOW = new Date(2026, 9, 14, 7, 0);

const EVERY_DAY: IntakeToSave["days"] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function insertLithium(database: Database): string {
  return insertMed(database, {
    name: "Lithium",
    strength: "250 mg",
    detail: "",
    design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
  }).id;
}

function dailyIntake(medId: string): IntakeToSave {
  return {
    time: { hour: 8, minute: 0 },
    days: EVERY_DAY,
    frequency: "daily",
    interval: 1,
    startsOn: "2026-10-01",
    reminderIntervalMinutes: 10,
    sound: "beep",
    medQuantities: [{ medId, quantity: 1 }],
  };
}

async function plannedRemindersOf(database: Database) {
  await rescheduleReminders(database, NOW);
  const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
  return plannedReminders;
}

function plannedDaysOf(plannedReminders: Awaited<ReturnType<typeof plannedRemindersOf>>) {
  return [
    ...new Set(
      plannedReminders
        .filter(({ reminderIntake }) => reminderIntake !== undefined)
        .map(({ date }) => toLocalDate(date)),
    ),
  ];
}

describe("rescheduleReminders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState(initialSettings, true);
  });

  it("only sets up the channels without the notification permission", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(false);

    await rescheduleReminders(createTestDatabase(), NOW);

    expect(setUpNotificationChannels).toHaveBeenCalledTimes(1);
    expect(resetReminders).not.toHaveBeenCalled();
  });

  it("sets up the channels of the default sounds and of the intake sounds", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    useSettingsStore.setState({ defaultReminderSound: "shire", lowStockSound: "drop" });

    await rescheduleReminders(createTestDatabase(), NOW);

    expect(setUpNotificationChannels).toHaveBeenCalledWith({
      reminders: ["shire", "beep", "beep", "beep", "beep", "beep", "nocturne"],
      lowStock: ["drop"],
    });
  });

  it("plans the low stock alerts in chronological order, with the low stock sound", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    useSettingsStore.setState({ lowStockSound: "vibration" });
    const database = createTestDatabase({ seed: false });
    const medId = insertLithium(database);
    saveIntake(database, dailyIntake(medId), new Date(2026, 9, 1));
    saveStock(database, { medId, quantity: 10, boxSize: 30, lowStockDays: 7 });

    const plannedReminders = await plannedRemindersOf(database);

    const alertIndex = plannedReminders.findIndex(({ identifier }) =>
      identifier.startsWith("low-stock-"),
    );
    const alert = plannedReminders[alertIndex];
    expect(alert).toMatchObject({ sound: "vibration", channelId: "low-stock-vibration" });
    expect(plannedReminders[alertIndex - 1].date < alert.date).toBe(true);
    expect(plannedReminders[alertIndex + 1].date > alert.date).toBe(true);
    expect(plannedReminders).toHaveLength(62);
    expect(plannedReminders[0].sound).toBe("beep");
  });

  it("fills the slots with the reminders of the next days", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    const plannedReminders = await plannedRemindersOf(createTestDatabase());

    expect(plannedReminders).toHaveLength(61);
    expect(plannedDaysOf(plannedReminders)).toEqual(["2026-10-14", "2026-10-15", "2026-10-16"]);
    expect(plannedReminders.some(({ identifier }) => identifier.startsWith("low-stock-"))).toBe(
      false,
    );
    expect(plannedReminders[0]).toMatchObject({
      title: "C'est l'heure de votre prise de 08:20",
      body: "1 × Magnésium 300 mg, 1 × Vitamine D 400 UI",
    });
  });

  it("skips the intakes already handled today", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    const plannedReminders = await plannedRemindersOf(
      createTestDatabase({ withLogs: true, now: NOW }),
    );

    expect(plannedReminders).toHaveLength(61);
    expect(plannedReminders[0].title).toBe("C'est l'heure de votre prise de 12:20");
    expect(plannedDaysOf(plannedReminders)).toEqual(["2026-10-14", "2026-10-15", "2026-10-16"]);
  });

  it("plans ten days of a single daily intake", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    const database = createTestDatabase({ seed: false });
    saveIntake(database, dailyIntake(insertLithium(database)), new Date(2026, 9, 1));

    const plannedReminders = await plannedRemindersOf(database);

    expect(plannedReminders).toHaveLength(61);
    expect(plannedDaysOf(plannedReminders)).toHaveLength(10);
    expect(plannedDaysOf(plannedReminders).at(-1)).toBe("2026-10-23");
  });

  it("follows the recurrence: nothing in a paused week, a monthly intake later", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    const database = createTestDatabase({ seed: false });
    const intake = {
      ...dailyIntake(insertLithium(database)),
      frequency: "weekly" as const,
      interval: 2,
      startsOn: "2026-10-05",
    };
    saveIntake(database, intake, new Date(2026, 9, 1));
    const monthlyIntakeId = saveIntake(
      database,
      { ...intake, frequency: "monthly", interval: 1, startsOn: "2026-09-15", days: [] },
      new Date(2026, 9, 1),
    );

    const plannedReminders = await plannedRemindersOf(database);

    expect(plannedReminders).toHaveLength(61);
    expect(
      plannedReminders
        .slice(0, 6)
        .every(({ identifier }) => identifier.startsWith(`reminder-${monthlyIntakeId}-2026-10-15`)),
    ).toBe(true);
    expect(plannedDaysOf(plannedReminders)).toEqual([
      "2026-10-15",
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
      "2026-10-23",
      "2026-10-24",
      "2026-10-25",
      "2026-11-02",
      "2026-11-03",
    ]);
  });

  it("ends with the reopen app warning, 5 minutes after the last reminder", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    const plannedReminders = await plannedRemindersOf(createTestDatabase());

    const lastReminderTime = Math.max(
      ...plannedReminders
        .filter(({ reminderIntake }) => reminderIntake !== undefined)
        .map(({ date }) => date.getTime()),
    );
    expect(plannedReminders.at(-1)).toMatchObject({
      identifier: "reopen-app-warning",
      date: new Date(lastReminderTime + 5 * 60_000),
    });
    expect(plannedReminders.at(-1)?.date).toEqual(new Date(2026, 9, 16, 13, 15));
  });
});
