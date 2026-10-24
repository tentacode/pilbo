import type { TFunction } from "i18next";

import type { Intake } from "@/domain/intake";
import { formatMedLabel, type Med } from "@/domain/med";
import { formatDayAndMonth } from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import { dailyQuantityOf, intakeTimesOf } from "./medSchedule";
import type { StockForecast } from "./stockForecast";
import type { StockItem } from "./stockTypes";

type DaysLeftDisplay =
  { kind: "days"; count: number; unit: string } | { kind: "text"; text: string };

export function formatPillUnit(t: TFunction<"stocks">, quantity: number): string {
  return t("comprimés", { count: quantity });
}

export function formatPillCount(t: TFunction<"stocks">, quantity: number): string {
  return t("{{count}} comprimés", { count: quantity });
}

export function formatDayCount(t: TFunction<"stocks">, days: number): string {
  return t("{{count}} jours", { count: days });
}

function noScheduleText(t: TFunction<"stocks">, med: Pick<Med, "isAsNeeded">): string {
  return med.isAsNeeded ? t("Si besoin") : t("Aucune prise prévue");
}

export function formatDaysLeft(
  t: TFunction<"stocks">,
  { med, forecast }: StockItem,
): DaysLeftDisplay {
  if (forecast.daysLeft === undefined) {
    return { kind: "text", text: noScheduleText(t, med) };
  }
  return {
    kind: "days",
    count: forecast.daysLeft,
    unit: t("jours", { count: forecast.daysLeft }),
  };
}

export function formatLowStockMention(
  t: TFunction<"stocks">,
  language: Language,
  { forecast }: StockItem,
): string {
  const { daysLeft, lastCoveredDate } = forecast;
  if (daysLeft === undefined || daysLeft === 0 || lastCoveredDate === undefined) {
    return t("Stock bas · à renouveler");
  }
  return t("Stock bas · jusqu’au {{date}}", { date: formatDayAndMonth(lastCoveredDate, language) });
}

export function formatStockCardAccessibilityLabel(
  t: TFunction<"stocks">,
  language: Language,
  stockItem: StockItem,
): string {
  const daysLeft = formatDaysLeft(t, stockItem);
  const status =
    stockItem.forecast.status === "low"
      ? formatLowStockMention(t, language, stockItem)
      : t("Stock suffisant");
  return [
    formatMedLabel(stockItem.med),
    formatPillCount(t, stockItem.stock.quantity),
    daysLeft.kind === "days" ? formatDayCount(t, daysLeft.count) : daysLeft.text,
    status.replace(" · ", " "),
  ].join(", ");
}

function joinWithAnd(t: TFunction<"stocks">, items: string[]): string {
  return items.length <= 1
    ? items.join("")
    : t("{{list}} et {{last}}", {
        list: items.slice(0, -1).join(", "),
        last: items[items.length - 1],
      });
}

export function formatMedSchedule(t: TFunction<"stocks">, med: Med, intakes: Intake[]): string {
  const times = intakeTimesOf(med.id, intakes);
  if (times.length === 0) {
    return noScheduleText(t, med);
  }
  const dailyQuantity = dailyQuantityOf(med.id, intakes);
  if (dailyQuantity !== undefined) {
    return t("{{pills}} par jour · {{times}}", {
      pills: formatPillCount(t, dailyQuantity),
      times: joinWithAnd(t, times),
    });
  }
  return t("Prises de {{times}}", { count: times.length, times: joinWithAnd(t, times) });
}

export function formatCoverage(
  t: TFunction<"stocks">,
  language: Language,
  med: Pick<Med, "isAsNeeded">,
  { daysLeft, lastCoveredDate }: StockForecast,
): { emphasis: string; rest: string } {
  if (daysLeft === undefined || lastCoveredDate === undefined) {
    return { emphasis: "", rest: noScheduleText(t, med) };
  }
  return {
    emphasis: formatDayCount(t, daysLeft),
    rest:
      daysLeft === 0
        ? t(", à renouveler")
        : t(", jusqu’au {{date}}", { date: formatDayAndMonth(lastCoveredDate, language) }),
  };
}

export function formatThresholdHelp(t: TFunction<"stocks">, pills: number, days: number): string {
  return t("Soit {{pills}} pour {{period}}.", {
    pills: formatPillCount(t, pills),
    period: t("les {{count}} prochains jours", { count: days }),
  });
}

export function formatStocksBelowZeroMessage(
  t: TFunction<"stocks">,
  meds: Pick<Med, "name" | "strength">[],
): string {
  const sentence = t("Les stocks de {{meds}} sont passés sous zéro.", {
    count: meds.length,
    meds: joinWithAnd(t, meds.map(formatMedLabel)),
  });
  return `${sentence} ${t("Pensez à mettre à jour les quantités dans Stock.")}`;
}

export function formatLowStockNotice(t: TFunction<"stocks">, lowStockCount: number): string {
  return t("Le stock de {{count}} de vos médicaments est trop bas, pensez à les renouveler.", {
    count: lowStockCount,
  });
}
