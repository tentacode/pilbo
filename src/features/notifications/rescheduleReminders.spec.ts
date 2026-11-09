import { createTestDatabase } from "@/shared/database/testDatabase";

import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { setUpNotificationChannels } from "./notificationChannels";
import { getPermissionGranted, resetReminders } from "./notifications";
import { rescheduleReminders } from "./rescheduleReminders";

jest.mock("./notifications", () => ({
  getPermissionGranted: jest.fn(),
  resetReminders: jest.fn(() => Promise.resolve()),
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
      reminders: ["shire", "beep", "beep", "beep", "nocturne"],
      lowStock: ["drop"],
    });
  });

  it("plans the low stock alerts with the low stock sound", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);
    useSettingsStore.setState({ lowStockSound: "vibration" });

    await rescheduleReminders(createTestDatabase(), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders.filter(({ sound }) => sound === "vibration")).toHaveLength(2);
    expect(plannedReminders[0].sound).toBe("beep");
  });

  it("plans the reminders of today, the low stock alerts and the reminders of tomorrow", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    await rescheduleReminders(createTestDatabase(), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders).toHaveLength(50);
    expect(plannedReminders.slice(24, 26)).toEqual([
      expect.objectContaining({
        identifier: "low-stock-2026-11-21",
        body: "Lamictal 50 mg : pensez à le renouveler.",
      }),
      expect.objectContaining({
        identifier: "low-stock-2026-12-02",
        body: "Lamictal 100 mg : pensez à le renouveler.",
      }),
    ]);
    expect(plannedReminders[0]).toMatchObject({
      title: "C'est l'heure de votre prise de 08:20",
      body: "1 × Lamictal 50 mg, 1 × Lithium 250 mg",
    });
  });

  it("skips the intakes already handled today", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(true);

    await rescheduleReminders(createTestDatabase({ withLogs: true, now: NOW }), NOW);

    const [plannedReminders] = jest.mocked(resetReminders).mock.calls[0];
    expect(plannedReminders).toHaveLength(44);
    expect(plannedReminders[0].title).toBe("C'est l'heure de votre prise de 12:20");
  });
});
