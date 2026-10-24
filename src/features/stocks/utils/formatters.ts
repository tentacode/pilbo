import type { Intake } from "@/domain/intake";
import { formatMedLabel, type Med } from "@/domain/med";

import { MONTH_NAMES } from "@/features/today/utils/formatters";
import { dailyQuantityOf, intakeTimesOf } from "./medSchedule";
import type { StockForecast } from "./stockForecast";
import type { StockItem } from "./stockTypes";

type DaysLeftDisplay =
  { kind: "days"; count: number; unit: string } | { kind: "text"; text: string };

function pluralize(count: number, singular: string, plural: string): string {
  return Math.abs(count) >= 2 ? plural : singular;
}

export function formatPillUnit(quantity: number): string {
  return pluralize(quantity, "comprimé", "comprimés");
}

export function formatPillCount(quantity: number): string {
  return `${quantity} ${formatPillUnit(quantity)}`;
}

export function formatDayCount(days: number): string {
  return `${days} ${pluralize(days, "jour", "jours")}`;
}

export function formatDayAndMonth(date: Date): string {
  const day = date.getDate();
  return `${day === 1 ? "1er" : day} ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatDaysLeft({ med, forecast }: StockItem): DaysLeftDisplay {
  if (forecast.daysLeft === undefined) {
    return { kind: "text", text: med.isAsNeeded ? "Si besoin" : "Aucune prise prévue" };
  }
  return {
    kind: "days",
    count: forecast.daysLeft,
    unit: pluralize(forecast.daysLeft, "jour", "jours"),
  };
}

export function formatLowStockMention({ forecast }: StockItem): string {
  const { daysLeft, lastCoveredDate } = forecast;
  if (daysLeft === undefined || daysLeft === 0 || lastCoveredDate === undefined) {
    return "Stock bas · à renouveler";
  }
  return `Stock bas · jusqu’au ${formatDayAndMonth(lastCoveredDate)}`;
}

export function formatStockCardAccessibilityLabel(stockItem: StockItem): string {
  const daysLeft = formatDaysLeft(stockItem);
  const status =
    stockItem.forecast.status === "low" ? formatLowStockMention(stockItem) : "Stock suffisant";
  return [
    formatMedLabel(stockItem.med),
    formatPillCount(stockItem.stock.quantity),
    daysLeft.kind === "days" ? formatDayCount(daysLeft.count) : daysLeft.text,
    status.replace(" · ", " "),
  ].join(", ");
}

function joinWithAnd(items: string[]): string {
  return items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

function noScheduleText(med: Pick<Med, "isAsNeeded">): string {
  return med.isAsNeeded ? "Si besoin" : "Aucune prise prévue";
}

export function formatMedSchedule(med: Med, intakes: Intake[]): string {
  const times = intakeTimesOf(med.id, intakes);
  if (times.length === 0) {
    return noScheduleText(med);
  }
  const dailyQuantity = dailyQuantityOf(med.id, intakes);
  if (dailyQuantity !== undefined) {
    return `${formatPillCount(dailyQuantity)} par jour · ${joinWithAnd(times)}`;
  }
  return `${times.length >= 2 ? "Prises" : "Prise"} de ${joinWithAnd(times)}`;
}

export function formatCoverage(
  med: Pick<Med, "isAsNeeded">,
  { daysLeft, lastCoveredDate }: StockForecast,
): { emphasis: string; rest: string } {
  if (daysLeft === undefined || lastCoveredDate === undefined) {
    return { emphasis: "", rest: noScheduleText(med) };
  }
  return {
    emphasis: formatDayCount(daysLeft),
    rest: daysLeft === 0 ? ", à renouveler" : `, jusqu’au ${formatDayAndMonth(lastCoveredDate)}`,
  };
}

export function formatThresholdHelp(pills: number, days: number): string {
  const period = days === 1 ? "le prochain jour" : `les ${days} prochains jours`;
  return `Soit ${formatPillCount(pills)} pour ${period}.`;
}

export function formatStocksBelowZeroMessage(meds: Pick<Med, "name" | "strength">[]): string {
  const labels = joinWithAnd(meds.map(formatMedLabel));
  const sentence =
    meds.length >= 2
      ? `Les stocks de ${labels} sont passés sous zéro.`
      : `Le stock de ${labels} est passé sous zéro.`;
  return `${sentence} Pensez à mettre à jour les quantités dans Stock.`;
}

export function formatLowStockNotice(lowStockCount: number): string {
  return lowStockCount >= 2
    ? `Le stock de ${lowStockCount} de vos médicaments est trop bas, pensez à les renouveler.`
    : "Le stock d’un de vos médicaments est trop bas, pensez à le renouveler.";
}
