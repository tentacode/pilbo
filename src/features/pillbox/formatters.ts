import { type Intake, type Weekday, WEEKDAYS } from "@/domain/intake";

const SHORT_DAY_NAMES: Record<Weekday, string> = {
  monday: "lun",
  tuesday: "mar",
  wednesday: "mer",
  thursday: "jeu",
  friday: "ven",
  saturday: "sam",
  sunday: "dim",
};

const FULL_DAY_NAMES: Record<Weekday, string> = {
  monday: "lundi",
  tuesday: "mardi",
  wednesday: "mercredi",
  thursday: "jeudi",
  friday: "vendredi",
  saturday: "samedi",
  sunday: "dimanche",
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDays(days: Weekday[], dayNames: Record<Weekday, string>): string {
  if (WEEKDAYS.every((day) => days.includes(day))) {
    return "Tous les jours";
  }
  return capitalize(
    WEEKDAYS.filter((day) => days.includes(day))
      .map((day) => dayNames[day])
      .join(", "),
  );
}

export function formatIntakeTime({ hour, minute }: Intake["time"]): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatIntakeSchedule(intake: Intake): string {
  return `${formatDays(intake.days, SHORT_DAY_NAMES)} · rappel toutes les ${intake.reminderIntervalMinutes} min`;
}

export function formatIntakeAccessibilityLabel(intake: Intake): string {
  const { hour, minute } = intake.time;
  const time = `${hour} h ${minute === 0 ? "" : String(minute).padStart(2, "0")}`.trim();
  const schedule = `${formatDays(intake.days, FULL_DAY_NAMES)}, rappel toutes les ${intake.reminderIntervalMinutes} minutes`;
  const meds = intake.medQuantities
    .map(({ med, quantity }) => `${med.name} ${med.strength}, quantité ${quantity}`)
    .join(". ");
  return `${time}. ${schedule}. ${meds}`;
}
