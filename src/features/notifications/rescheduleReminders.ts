import { sortIntakeMeds } from "@/domain/intake";
import { addDays, toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockItems";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";
import { setUpNotificationChannels } from "./notificationChannels";
import { getPermissionGranted, resetReminders } from "./notifications";
import { planLowStockAlerts } from "./utils/planLowStockAlerts";
import { planReminders } from "./utils/planReminders";

export async function rescheduleReminders(database: Database, now: Date): Promise<void> {
  const { defaultReminderSound, lowStockSound } = useSettingsStore.getState();
  // Before the permission check: Android 13+ only asks for the permission once a channel exists.
  await setUpNotificationChannels({
    reminders: [defaultReminderSound, ...getAllIntakes(database).map(({ sound }) => sound)],
    lowStock: [lowStockSound],
  });
  if (!(await getPermissionGranted())) {
    return;
  }
  const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
  const stockItems = computeStockItems(medStocks, intakes, intakeLogs, now);
  const plannedReminders = planReminders({
    todayIntakes: getIntakesOfDay(database, now).map(sortIntakeMeds),
    tomorrowIntakes: getIntakesOfDay(database, addDays(now, 1)).map(sortIntakeMeds),
    todayLogs: getIntakeLogsOfDay(database, toLocalDate(now)),
    lowStockAlerts: planLowStockAlerts(stockItems, now, lowStockSound),
    now,
  });
  await resetReminders(plannedReminders);
}
