import { LOW_STOCK_ALERT_HOUR, lowStockChannelId } from "@/config/notifications";
import { toLocalDate } from "@/domain/intakeLog";
import { compareMeds, type Med } from "@/domain/med";
import type { NotificationSound } from "@/domain/sound";

import type { StockItem } from "@/features/stocks/utils/stockTypes";
import { formatLowStockAlertBody, formatLowStockAlertTitle } from "./formatters";
import { LOW_STOCK_IDENTIFIER_PREFIX } from "./notificationTab";
import type { PlannedReminder } from "./planReminders";

export function planLowStockAlerts(
  stockItems: StockItem[],
  now: Date,
  sound: NotificationSound,
): PlannedReminder[] {
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
    if (date <= now) {
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
      identifier: `${LOW_STOCK_IDENTIFIER_PREFIX}${day}`,
      date,
      title: formatLowStockAlertTitle(),
      body: formatLowStockAlertBody([...meds].sort(compareMeds)),
      interruptionLevel: "active",
      sound,
      channelId: lowStockChannelId(sound),
    }));
}
