import { formatIntakeTime, type Intake } from "@/domain/intake";
import type { IntakeLogStatus } from "@/domain/intakeLog";
import { formatMedLabel, type MedQuantity } from "@/domain/med";

import { weekdayOf } from "./computeTodayIntakes";
import type { FormattedText, TodayIntake, UpcomingIntake } from "./todayTypes";

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

const TIME_START_INDEX = "2026-10-14T".length;

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

function same(text: string): FormattedText {
  return { text, accessibilityLabel: text };
}

export function formatIntakeStatus({
  status,
  minutesFromNow,
  validation,
}: TodayIntake): FormattedText {
  if (status === "skipped") {
    return same("Ignorée");
  }
  if (status === "taken" && validation) {
    const time = formatIntakeTime(validation.time);
    return same(validation.isTakenLate ? `Pris en retard à ${time}` : `Pris à ${time}`);
  }
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
    return same("C'est l'heure");
  }
  return same("À venir");
}

export function formatMedNames(medQuantities: MedQuantity[]): string {
  return medQuantities
    .map(({ med, quantity }) => {
      const name = formatMedLabel(med);
      return quantity >= 2 ? `${name} (${quantity} ×)` : name;
    })
    .join(" · ");
}

export function formatEarlierIntakeAccessibilityLabel(todayIntake: TodayIntake): string {
  const meds = todayIntake.intake.medQuantities.map(
    ({ med, quantity }) => `${formatMedLabel(med)}, quantité ${quantity}`,
  );
  return [
    formatIntakeTime(todayIntake.intake.time),
    formatIntakeStatus(todayIntake).accessibilityLabel,
    ...meds,
  ].join(", ");
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

export function formatValidationAnnouncement(intake: Intake, status: IntakeLogStatus): string {
  const time = formatIntakeTime(intake.time);
  return status === "taken" ? `Prise de ${time} validée` : `Prise de ${time} ignorée`;
}

export function formatAsNeededTakenAt(takenAt: string): string {
  return `Pris à ${takenAt.slice(TIME_START_INDEX)}`;
}

function formatUpcomingDay({ daysAhead, weekday }: UpcomingIntake): string {
  const dayName = DAY_NAMES[weekday].toLowerCase();
  if (daysAhead === 1) {
    return "demain";
  }
  return daysAhead === 7 ? `${dayName} prochain` : dayName;
}

export function formatUpcomingIntakeSentence(upcomingIntake: UpcomingIntake): string {
  const time = formatIntakeTime(upcomingIntake.intake.time);
  return `Prochaine prise ${formatUpcomingDay(upcomingIntake)} à ${time}.`;
}
