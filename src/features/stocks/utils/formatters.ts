import type { TFunction } from "i18next";

import { type Intake, isEveryDay } from "@/domain/intake";
import { formatMedLabel, type Med } from "@/domain/med";
import { formatDayAndMonth, formatIntakeTime } from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import { formatRecurrence } from "@/features/pillbox/utils/recurrenceFormatters";
import { scheduledIntakesOf } from "./medSchedule";
import type { StockForecast } from "./stockForecast";

export function formatPillUnit(t: TFunction<"stocks">, quantity: number): string {
  return t("comprimés", { count: quantity });
}

export function formatPillCount(t: TFunction<"stocks">, quantity: number): string {
  return t("{{count}} comprimés", { count: quantity });
}

export function formatDayCount(t: TFunction<"stocks">, days: number): string {
  return t("{{count}} jours", { count: days });
}

function noScheduleText(t: TFunction<"stocks">): string {
  return t("Aucune prise prévue");
}

function joinWithAnd(t: TFunction<"stocks">, items: string[]): string {
  return items.length <= 1
    ? items.join("")
    : t("{{list}} et {{last}}", {
        list: items.slice(0, -1).join(", "),
        last: items[items.length - 1],
      });
}

export type MedScheduleText = {
  subtitle: string;
  detail?: string;
};

export function formatMedSchedule(
  t: TFunction<"stocks">,
  translatePillbox: TFunction<"pillbox">,
  language: Language,
  med: Med,
  intakes: Intake[],
): MedScheduleText {
  const scheduledIntakes = scheduledIntakesOf(med.id, intakes);
  if (scheduledIntakes.length === 0) {
    return { subtitle: noScheduleText(t) };
  }
  if (scheduledIntakes.length > 1) {
    return { subtitle: t("{{count}} prises", { count: scheduledIntakes.length }) };
  }
  const [intake] = scheduledIntakes;
  const subtitle = t("1 prise à {{time}}", { time: formatIntakeTime(intake.time) });
  return isEveryDay(intake)
    ? { subtitle }
    : { subtitle, detail: formatRecurrence(translatePillbox, language, intake) };
}

export function formatCoverage(
  t: TFunction<"stocks">,
  language: Language,
  { daysLeft, lastCoveredDate }: StockForecast,
): { emphasis: string; rest: string } {
  if (daysLeft === undefined || lastCoveredDate === undefined) {
    return { emphasis: "", rest: noScheduleText(t) };
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
  return `${sentence} ${t("Pensez à mettre à jour les quantités dans Médicaments.")}`;
}

export function formatLowStockNotice(t: TFunction<"stocks">, lowStockCount: number): string {
  return t("Le stock de {{count}} de vos médicaments est trop bas, pensez à les renouveler.", {
    count: lowStockCount,
  });
}
