import { sortIntakeMeds } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockItems";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakeVersionsOn } from "@/features/today/queries/getIntakesOfDay";
import { setUpNotificationChannels } from "./notificationChannels";
import { getPermissionGranted, resetReminders } from "./notifications";
import { registerReminderActions } from "./reminderActionCategory";
import { planIntakeDays } from "./utils/planIntakeDays";
import { planLowStockAlerts } from "./utils/planLowStockAlerts";
import { planReminders } from "./utils/planReminders";
import { planReopenAppWarning } from "./utils/planReopenAppWarning";

let rescheduling: Promise<void> = Promise.resolve();

// Serialized: concurrent runs would interleave their cancel and schedule calls.
export function rescheduleReminders(database: Database, now: Date): Promise<void> {
  const run = rescheduling.then(() => reschedule(database, now));
  rescheduling = run.catch(() => undefined);
  return run;
}

async function reschedule(database: Database, now: Date): Promise<void> {
  const { defaultReminderSound, lowStockSound } = useSettingsStore.getState();
  // Before the permission check: Android 13+ only asks for the permission once a channel exists.
  await setUpNotificationChannels({
    reminders: [defaultReminderSound, ...getAllIntakes(database).map(({ sound }) => sound)],
    lowStock: [lowStockSound],
  });
  if (!(await getPermissionGranted())) {
    return;
  }
  await registerReminderActions();
  const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
  const stockItems = computeStockItems(medStocks, intakes, intakeLogs, now);
  const plannedReminders = planReminders({
    intakeDays: planIntakeDays(getIntakeVersionsOn(database, now).map(sortIntakeMeds), now),
    todayLogs: getIntakeLogsOfDay(database, toLocalDate(now)),
    lowStockAlerts: planLowStockAlerts(stockItems, now, lowStockSound),
    now,
  });
  await resetReminders([
    ...plannedReminders,
    ...planReopenAppWarning(plannedReminders, lowStockSound),
  ]);
}
