import { formatIntakeTime, type Intake } from "@/domain/intake";

import { countTodayIntakes, weekdayOf } from "./computeTodayIntakes";
import type { FormattedText, TodayIntake, TodaySections, TodaySummary } from "./todayTypes";

const DAY_NAMES = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
} as const;

const MONTH_NAMES = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count >= 2 ? plural : singular}`;
}

export function formatTodayDate(date: Date): string {
  return `${DAY_NAMES[weekdayOf(date)]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatDuration(totalMinutes: number): string {
  const absoluteMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  if (hours === 0) {
    return `${minutes} min`;
  }
  if (minutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${String(minutes).padStart(2, "0")}`;
}

export function formatDurationAccessibilityLabel(totalMinutes: number): string {
  const absoluteMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  const hoursText = pluralize(hours, "heure", "heures");
  const minutesText = pluralize(minutes, "minute", "minutes");
  if (hours === 0) {
    return minutesText;
  }
  if (minutes === 0) {
    return hoursText;
  }
  return `${hoursText} ${minutesText}`;
}

export function formatIntakeStatus({ status, minutesFromNow }: TodayIntake): FormattedText {
  if (status === "late") {
    return {
      text: `En retard · ${formatDuration(minutesFromNow)}`,
      accessibilityLabel: `En retard de ${formatDurationAccessibilityLabel(minutesFromNow)}`,
    };
  }
  if (status === "next" && minutesFromNow > 0) {
    return {
      text: `Dans ${formatDuration(minutesFromNow)}`,
      accessibilityLabel: `Dans ${formatDurationAccessibilityLabel(minutesFromNow)}`,
    };
  }
  if (status === "next") {
    return { text: "C'est l'heure", accessibilityLabel: "C'est l'heure" };
  }
  return { text: "À venir", accessibilityLabel: "À venir" };
}

export function formatTodaySummary(sections: TodaySections): TodaySummary | null {
  const total = countTodayIntakes(sections);
  if (total === 0) {
    return null;
  }
  const { late, next } = sections;
  const takenCount = 0;
  const progress = `${pluralize(takenCount, "prise", "prises")} sur ${total}`;
  const detail =
    next && late.length === 0
      ? `prochaine à ${formatIntakeTime(next.intake.time)}`
      : `${late.length} en retard`;
  return { progress, detail, accessibilityLabel: `${progress}, ${detail}` };
}

export function formatLateSectionTitle(lateCount: number): string | null {
  return lateCount >= 2 ? `${lateCount} prises en retard` : null;
}

export function formatTakeAccessibilityLabel(intake: Intake): string {
  return `Prendre la prise de ${formatIntakeTime(intake.time)}`;
}

export function formatSkipAccessibilityLabel(intake: Intake): string {
  return `Ignorer la prise de ${formatIntakeTime(intake.time)}`;
}
