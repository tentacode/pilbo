import { createTestDatabase } from "@/shared/database/testDatabase";

import { insertMed } from "@/features/pillbox/queries/insertMed";
import { type IntakeToSave, saveIntake } from "@/features/pillbox/queries/saveIntake";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
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

  it("plans the low stock alerts with the low stock sound", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    useSettingsStore.setState({ lowStockSound: "vibration" });

    await rescheduleReminders(createTestDatabase(), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders.filter(({ sound }) => sound === "vibration")).toHaveLength(3);
    expect(plannedReminders[0].sound).toBe("beep");
  });

  it("plans the reminders of today, the low stock alerts and the reminders of tomorrow", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    await rescheduleReminders(createTestDatabase(), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders).toHaveLength(51);
    expect(plannedReminders.slice(24, 26)).toEqual([
      expect.objectContaining({
        identifier: "low-stock-2026-11-21",
        body: "Vitamine D 400 UI : pensez à le renouveler.",
      }),
      expect.objectContaining({
        identifier: "low-stock-2026-12-02",
        body: "Vitamine D 1000 UI : pensez à le renouveler.",
      }),
    ]);
    expect(plannedReminders[0]).toMatchObject({
      title: "C'est l'heure de votre prise de 08:20",
      body: "1 × Magnésium 300 mg, 1 × Vitamine D 400 UI",
    });
  });

  it("skips the intakes already handled today", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    await rescheduleReminders(createTestDatabase({ withLogs: true, now: NOW }), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders).toHaveLength(57);
    expect(plannedReminders[0].title).toBe("C'est l'heure de votre prise de 12:20");
  });

  it("follows the recurrence: nothing in a paused week, a monthly intake tomorrow", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    const database = createTestDatabase({ seed: false });
    const { id: medId } = insertMed(database, {
      name: "Lithium",
      strength: "250 mg",
      detail: "",
      design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
    });
    const intake: IntakeToSave = {
      time: { hour: 9, minute: 0 },
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      frequency: "weekly",
      interval: 2,
      startsOn: "2026-10-05",
      reminderIntervalMinutes: 10,
      sound: "beep",
      medQuantities: [{ medId, quantity: 1 }],
    };
    saveIntake(database, intake, new Date(2026, 9, 1));
    const monthlyIntakeId = saveIntake(
      database,
      { ...intake, frequency: "monthly", interval: 1, startsOn: "2026-09-15", days: [] },
      new Date(2026, 9, 1),
    );

    await rescheduleReminders(database, NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders).toHaveLength(7);
    expect(
      plannedReminders
        .slice(0, 6)
        .every(({ identifier }) => identifier.startsWith(`reminder-${monthlyIntakeId}-2026-10-15`)),
    ).toBe(true);
  });

  it("ends with the reopen app warning, 5 minutes after the last reminder", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    await rescheduleReminders(createTestDatabase(), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    const lastReminderTime = Math.max(
      ...plannedReminders
        .filter(({ reminderIntake }) => reminderIntake !== undefined)
        .map(({ date }) => date.getTime()),
    );
    expect(plannedReminders.at(-1)).toMatchObject({
      identifier: "reopen-app-warning",
      date: new Date(lastReminderTime + 5 * 60_000),
    });
  });
});
