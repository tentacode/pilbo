import { createTestDatabase } from "@/shared/database/testDatabase";

import { getPermissionGranted, resetReminders } from "./notifications";
import { rescheduleReminders } from "./rescheduleReminders";

jest.mock("./notifications", () => ({
  getPermissionGranted: jest.fn(),
  resetReminders: jest.fn(() => Promise.resolve()),
}));

const NOW = new Date(2026, 9, 14, 7, 0);

describe("rescheduleReminders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does nothing without the notification permission", async () => {
    jest.mocked(getPermissionGranted).mockResolvedValue(false);

    await rescheduleReminders(createTestDatabase(), NOW);

    expect(resetReminders).not.toHaveBeenCalled();
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
