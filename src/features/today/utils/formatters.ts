import type { TFunction } from "i18next";

import type { Intake } from "@/domain/intake";
import type { IntakeLogStatus } from "@/domain/intakeLog";
import { formatMedLabel, type MedQuantity } from "@/domain/med";
import { formatFullDate, formatIntakeTime, formatWeekday } from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import type { FormattedText, TodayIntake, UpcomingIntake } from "./todayTypes";

const TIME_START_INDEX = "2026-10-14T".length;

export function formatTodayDate(date: Date, language: Language): string {
  return formatFullDate(date, language);
}

function splitDuration(totalMinutes: number): { hours: number; minutes: number } {
  const absoluteMinutes = Math.abs(totalMinutes);
  return { hours: Math.floor(absoluteMinutes / 60), minutes: absoluteMinutes % 60 };
}

export function formatDuration(t: TFunction<"today">, totalMinutes: number): string {
  const { hours, minutes } = splitDuration(totalMinutes);
  if (hours === 0) {
    return t("{{minutes}} min", { minutes });
  }
  if (minutes === 0) {
    return t("{{hours}} h", { hours });
  }
  return t("{{hours}} h {{minutes}}", { hours, minutes: String(minutes).padStart(2, "0") });
}

export function formatDurationAccessibilityLabel(
  t: TFunction<"today">,
  totalMinutes: number,
): string {
  const { hours, minutes } = splitDuration(totalMinutes);
  const hoursText = t("{{count}} heures", { count: hours });
  const minutesText = t("{{count}} minutes", { count: minutes });
  if (hours === 0) {
    return minutesText;
  }
  if (minutes === 0) {
    return hoursText;
  }
  return `${hoursText} ${minutesText}`;
}

function same(text: string): FormattedText {
  return { text, accessibilityLabel: text };
}

export function formatIntakeStatus(
  t: TFunction<"today">,
  { status, minutesFromNow, validation }: TodayIntake,
): FormattedText {
  if (status === "skipped") {
    return same(t("Ignorée"));
  }
  if (status === "taken" && validation) {
    const time = formatIntakeTime(validation.time);
    return same(
      validation.isTakenLate
        ? t("Pris en retard à {{time}}", { time })
        : t("Pris à {{time}}", { time }),
    );
  }
  if (status === "late") {
    return {
      text: t("En retard · {{duration}}", { duration: formatDuration(t, minutesFromNow) }),
      accessibilityLabel: t("En retard de {{duration}}", {
        duration: formatDurationAccessibilityLabel(t, minutesFromNow),
      }),
    };
  }
  if (status === "next" && minutesFromNow > 0) {
    return {
      text: t("Dans {{duration}}", { duration: formatDuration(t, minutesFromNow) }),
      accessibilityLabel: t("Dans {{duration}}", {
        duration: formatDurationAccessibilityLabel(t, minutesFromNow),
      }),
    };
  }
  if (status === "next") {
    return same(t("C'est l'heure"));
  }
  return same(t("À venir"));
}

export function formatMedNames(medQuantities: MedQuantity[]): string {
  return medQuantities
    .map(({ med, quantity }) => {
      const name = formatMedLabel(med);
      return quantity >= 2 ? `${name} (${quantity} ×)` : name;
    })
    .join(" · ");
}

export function formatQuantityAccessibilityLabel(t: TFunction<"today">, quantity: number): string {
  return t("quantité {{quantity}}", { quantity });
}

export function formatEarlierIntakeAccessibilityLabel(
  t: TFunction<"today">,
  todayIntake: TodayIntake,
): string {
  const meds = todayIntake.intake.medQuantities.map(
    ({ med, quantity }) =>
      `${formatMedLabel(med)}, ${formatQuantityAccessibilityLabel(t, quantity)}`,
  );
  return [
    formatIntakeTime(todayIntake.intake.time),
    formatIntakeStatus(t, todayIntake).accessibilityLabel,
    ...meds,
  ].join(", ");
}

export function formatLateSectionTitle(t: TFunction<"today">, lateCount: number): string | null {
  return lateCount >= 2 ? t("{{count}} prises en retard", { count: lateCount }) : null;
}

export function formatTakeAccessibilityLabel(t: TFunction<"today">, intake: Intake): string {
  return t("Prendre la prise de {{time}}", { time: formatIntakeTime(intake.time) });
}

export function formatSkipAccessibilityLabel(t: TFunction<"today">, intake: Intake): string {
  return t("Ignorer la prise de {{time}}", { time: formatIntakeTime(intake.time) });
}

export function formatValidationAnnouncement(
  t: TFunction<"today">,
  intake: Intake,
  status: IntakeLogStatus,
): string {
  const time = formatIntakeTime(intake.time);
  return status === "taken"
    ? t("Prise de {{time}} validée", { time })
    : t("Prise de {{time}} ignorée", { time });
}

export function formatTakenTime(takenAt: string): string {
  const [hour, minute] = takenAt.slice(TIME_START_INDEX).split(":").map(Number);
  return formatIntakeTime({ hour, minute });
}

export function formatAsNeededTakenAt(t: TFunction<"today">, takenAt: string): string {
  return t("Pris à {{time}}", { time: formatTakenTime(takenAt) });
}

export function formatUpcomingIntakeSentence(
  t: TFunction<"today">,
  language: Language,
  { daysAhead, weekday, intake }: UpcomingIntake,
): string {
  const time = formatIntakeTime(intake.time);
  const day = formatWeekday(weekday, language, "long");
  if (daysAhead === 1) {
    return t("Prochaine prise demain à {{time}}.", { time });
  }
  return daysAhead === 7
    ? t("Prochaine prise {{day}} prochain à {{time}}.", { day, time })
    : t("Prochaine prise {{day}} à {{time}}.", { day, time });
}
