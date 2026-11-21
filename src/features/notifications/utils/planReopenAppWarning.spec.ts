import { createIntake } from "@/features/today/utils/testIntakes";

import { planIntakeDays } from "./planIntakeDays";
import { planReminders } from "./planReminders";
import { planReopenAppWarning } from "./planReopenAppWarning";

const LOW_STOCK_ALERT = {
  identifier: "low-stock-2026-10-08",
  date: new Date(2026, 9, 8, 9, 0),
  title: "Stock bas",
  body: "Lithium 250 mg : pensez à le renouveler.",
  interruptionLevel: "active" as const,
  sound: "beep" as const,
  channelId: "low-stock",
};

describe("planReopenAppWarning", () => {
  it("plans the warning 5 minutes after the last intake reminder of the last planned day", () => {
    const now = new Date(2026, 9, 4, 7, 0);
    const plannedReminders = planReminders({
      intakeDays: planIntakeDays([createIntake(12, 20)], now),
      todayLogs: [],
      lowStockAlerts: [LOW_STOCK_ALERT],
      now,
    });

    expect(planReopenAppWarning(plannedReminders, "beep")).toEqual([
      {
        identifier: "reopen-app-warning",
        date: new Date(2026, 9, 13, 13, 15),
        title: "⚠️ Attention",
        body: "Vous devez ouvrir Pilbo pour continuer à recevoir vos rappels. Sinon, vous n'en recevrez plus.",
        interruptionLevel: "active",
        sound: "beep",
        channelId: "low-stock",
      },
    ]);
  });

  it("plans nothing without intake reminders", () => {
    expect(planReopenAppWarning([], "beep")).toEqual([]);
    expect(planReopenAppWarning([LOW_STOCK_ALERT], "beep")).toEqual([]);
  });

  it("uses the low stock sound and its channel", () => {
    const now = new Date(2026, 9, 4, 7, 0);
    const plannedReminders = planReminders({
      intakeDays: [{ day: now, intakes: [createIntake(12, 20)] }],
      todayLogs: [],
      now,
    });

    expect(planReopenAppWarning(plannedReminders, "vibration")[0]).toMatchObject({
      sound: "vibration",
      channelId: "low-stock-vibration",
    });
  });
});
