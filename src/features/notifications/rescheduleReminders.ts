import { sortIntakeMeds } from "@/domain/intake";
import { addDays, toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockSections";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";
import { getPermissionGranted, resetReminders } from "./notifications";
import { planLowStockAlerts } from "./utils/planLowStockAlerts";
import { planReminders } from "./utils/planReminders";

export async function rescheduleReminders(database: Database, now: Date): Promise<void> {
  if (!(await getPermissionGranted())) {
    return;
  }
  const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
  const plannedReminders = planReminders({
    todayIntakes: getIntakesOfDay(database, now).map(sortIntakeMeds),
    tomorrowIntakes: getIntakesOfDay(database, addDays(now, 1)).map(sortIntakeMeds),
    todayLogs: getIntakeLogsOfDay(database, toLocalDate(now)),
    lowStockAlerts: planLowStockAlerts(computeStockItems(medStocks, intakes, intakeLogs, now), now),
    now,
  });
  await resetReminders(plannedReminders);
}
