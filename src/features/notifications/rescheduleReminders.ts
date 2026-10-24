import { sortIntakeMeds } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockSections";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getTodayIntakes } from "@/features/today/queries/getTodayIntakes";
import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";
import { getPermissionGranted, resetReminders } from "./notifications";
import { planLowStockAlerts } from "./utils/planLowStockAlerts";
import { planReminders } from "./utils/planReminders";

export async function rescheduleReminders(database: Database, now: Date): Promise<void> {
  if (!(await getPermissionGranted())) {
    return;
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
  const plannedReminders = planReminders({
    todayIntakes: getTodayIntakes(database, weekdayOf(now)).map(sortIntakeMeds),
    tomorrowIntakes: getTodayIntakes(database, weekdayOf(tomorrow)).map(sortIntakeMeds),
    todayLogs: getIntakeLogsOfDay(database, toLocalDate(now)),
    lowStockAlerts: planLowStockAlerts(computeStockItems(medStocks, intakes, intakeLogs, now), now),
    now,
  });
  await resetReminders(plannedReminders);
}
