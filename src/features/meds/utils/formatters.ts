import type { TFunction } from "i18next";

import type { Intake } from "@/domain/intake";
import { addDaysToLocalDate, fromLocalDateTime, toLocalDate } from "@/domain/intakeLog";
import { formatMedLabel, type Med } from "@/domain/med";
import { formatDayAndMonth, formatIntakeTime } from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import { formatTakenTime } from "@/features/today/utils/formatters";
import type { MedTakingSummary } from "@/features/meds/queries/getMedTakingSummary";
import type { MedListItem } from "./medsTypes";

export function formatPillAbbreviation(t: TFunction<"meds">, quantity: number): string {
  return t("{{count}} cp", { count: quantity });
}

export function formatPillUnitAbbreviation(t: TFunction<"meds">, quantity: number): string {
  return t("cp", { count: quantity });
}

export function formatPillCount(t: TFunction<"meds">, quantity: number): string {
  return t("{{count}} comprimés", { count: quantity });
}

export function formatDayUnit(t: TFunction<"meds">, days: number): string {
  return t("jours", { count: days });
}

export function formatMedRowAccessibilityLabel(
  t: TFunction<"meds">,
  { med, stockStatus }: MedListItem,
): string {
  if (stockStatus === undefined) {
    return `${formatMedLabel(med)}, ${t("stock non suivi")}`;
  }
  const { stock, forecast } = stockStatus;
  return [
    formatMedLabel(med),
    forecast.status === "low" ? t("stock bas") : undefined,
    forecast.daysLeft === undefined
      ? undefined
      : t("{{count}} jours", { count: forecast.daysLeft }),
    formatPillCount(t, stock.quantity),
  ]
    .filter(Boolean)
    .join(", ");
}

function joinWithAnd(t: TFunction<"meds">, items: string[]): string {
  return items.length <= 1
    ? items.join("")
    : t("{{list}} et {{last}}", {
        list: items.slice(0, -1).join(", "),
        last: items[items.length - 1],
      });
}

function formatIntakeTimes(t: TFunction<"meds">, intakes: Intake[]): string {
  return joinWithAnd(
    t,
    intakes.map(({ time }) => formatIntakeTime(time)),
  );
}

export function formatScheduledTakeMessage(t: TFunction<"meds">, intakes: Intake[]): string {
  return t("Ce médicament est prévu dans la prise de {{times}}.", {
    count: intakes.length,
    times: formatIntakeTimes(t, intakes),
  });
}

export function formatArchiveRefusedMessage(t: TFunction<"meds">, intakes: Intake[]): string {
  return t("Ce médicament est dans la prise de {{times}}. Retirez-le du pilulier d’abord.", {
    count: intakes.length,
    times: formatIntakeTimes(t, intakes),
  });
}

export function formatTakingSummary(
  t: TFunction<"meds">,
  language: Language,
  { todayQuantity, lastTakenAt }: MedTakingSummary,
  now: Date,
): string | undefined {
  if (lastTakenAt === undefined) {
    return undefined;
  }
  const time = formatTakenTime(lastTakenAt);
  if (todayQuantity > 0) {
    return t("{{count}} comprimés aujourd’hui · dernier à {{time}}", {
      count: todayQuantity,
      time,
    });
  }
  const yesterday = addDaysToLocalDate(toLocalDate(now), -1);
  if (lastTakenAt.startsWith(yesterday)) {
    return t("Dernière prise : hier à {{time}}", { time });
  }
  return t("Dernière prise : le {{date}} à {{time}}", {
    date: formatDayAndMonth(fromLocalDateTime(lastTakenAt), language),
    time,
  });
}

export function formatMedIntakeDetails(
  t: TFunction<"meds">,
  { intake, days, medId }: { intake: Intake; days: string; medId: string },
): string {
  const quantity = intake.medQuantities.find(({ med }) => med.id === medId)?.quantity ?? 0;
  return t("{{days}} · {{pills}}", { days, pills: formatPillCount(t, quantity) });
}

export function formatTakenAnnouncement(t: TFunction<"meds">, med: Med, takenAt: string): string {
  return t("{{med}} pris à {{time}}", { med: formatMedLabel(med), time: formatTakenTime(takenAt) });
}

export function formatUndoneAnnouncement(t: TFunction<"meds">, med: Med, takenAt: string): string {
  return t("Prise de {{med}} de {{time}} annulée", {
    med: formatMedLabel(med),
    time: formatTakenTime(takenAt),
  });
}
