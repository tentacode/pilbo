import {
  LOW_STOCK_ALERT_HOUR,
  MINIMUM_DELAY_BEFORE_REMINDER_SECONDS,
} from "@/config/notifications";
import { toLocalDate } from "@/domain/intakeLog";
import { compareMeds, type Med } from "@/domain/med";

import type { StockItem } from "@/features/stocks/utils/stockTypes";
import { formatLowStockAlertBody } from "./formatters";
import type { PlannedReminder } from "./planReminders";

const MILLISECONDS_PER_SECOND = 1_000;
const LOW_STOCK_ALERT_TITLE = "Stock bas";

export function planLowStockAlerts(stockItems: StockItem[], now: Date): PlannedReminder[] {
  const earliestDate = new Date(
    now.getTime() + MINIMUM_DELAY_BEFORE_REMINDER_SECONDS * MILLISECONDS_PER_SECOND,
  );
  const medsByDay = new Map<string, { date: Date; meds: Med[] }>();

  for (const { med, forecast } of stockItems) {
    if (forecast.lowStockDate === undefined) {
      continue;
    }
    const { lowStockDate } = forecast;
    const date = new Date(
      lowStockDate.getFullYear(),
      lowStockDate.getMonth(),
      lowStockDate.getDate(),
      LOW_STOCK_ALERT_HOUR,
    );
    if (date <= earliestDate) {
      continue;
    }
    const day = toLocalDate(date);
    const alert = medsByDay.get(day) ?? { date, meds: [] };
    alert.meds.push(med);
    medsByDay.set(day, alert);
  }

  return [...medsByDay.entries()]
    .sort(([firstDay], [secondDay]) => firstDay.localeCompare(secondDay))
    .map(([day, { date, meds }]) => ({
      identifier: `low-stock-${day}`,
      date,
      title: LOW_STOCK_ALERT_TITLE,
      body: formatLowStockAlertBody([...meds].sort(compareMeds)),
    }));
}
