import { createIntake } from "@/features/today/utils/testIntakes";

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
  it("plans the warning 5 minutes after the last intake reminder", () => {
    const plannedReminders = planReminders({
      todayIntakes: [createIntake(12, 20)],
      tomorrowIntakes: [createIntake(8, 20)],
      todayLogs: [],
      lowStockAlerts: [LOW_STOCK_ALERT],
      now: new Date(2026, 9, 4, 7, 0),
    });

    expect(planReopenAppWarning(plannedReminders, "beep")).toEqual([
      {
        identifier: "reopen-app-warning",
        date: new Date(2026, 9, 5, 9, 15),
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
    const plannedReminders = planReminders({
      todayIntakes: [createIntake(12, 20)],
      tomorrowIntakes: [],
      todayLogs: [],
      now: new Date(2026, 9, 4, 7, 0),
    });

    expect(planReopenAppWarning(plannedReminders, "vibration")[0]).toMatchObject({
      sound: "vibration",
      channelId: "low-stock-vibration",
    });
  });
});
