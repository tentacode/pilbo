import { type Intake, type Weekday, WEEKDAYS } from "@/domain/intake";
import { pillSwatches, type PillSwatch } from "@/design-system/tokens";
import { formatMedLabel, type PillDesign, type PillShape, type PillSize } from "@/domain/med";

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

const DAY_INITIALS: Record<Weekday, string> = {
  monday: "Lu",
  tuesday: "Ma",
  wednesday: "Me",
  thursday: "Je",
  friday: "Ve",
  saturday: "Sa",
  sunday: "Di",
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

export function formatIntakeSchedule(intake: Intake): string {
  return `${formatDays(intake.days, SHORT_DAY_NAMES)} · rappel toutes les ${intake.reminderIntervalMinutes} min`;
}

export function formatIntakeAccessibilityLabel(intake: Intake): string {
  const { hour, minute } = intake.time;
  const time = `${hour} h ${minute === 0 ? "" : String(minute).padStart(2, "0")}`.trim();
  const schedule = `${formatDays(intake.days, FULL_DAY_NAMES)}, rappel toutes les ${intake.reminderIntervalMinutes} minutes`;
  const meds = intake.medQuantities
    .map(({ med, quantity }) => `${formatMedLabel(med)}, quantité ${quantity}`)
    .join(". ");
  return `${time}. ${schedule}. ${meds}`;
}

export function formatDayInitials(day: Weekday): string {
  return DAY_INITIALS[day];
}

export function formatDayName(day: Weekday): string {
  return capitalize(FULL_DAY_NAMES[day]);
}

const SHAPE_NAMES: Record<PillShape, string> = {
  round: "rond",
  oval: "ovale",
  capsule: "gélule",
  softgel: "capsule molle",
};

const SIZE_NAMES: Record<PillSize, string> = {
  small: "petite",
  medium: "moyenne",
  large: "grande",
};

const SWATCH_NAMES: Record<PillSwatch, string> = {
  white: "blanc",
  yellow: "jaune",
  pink: "rose",
  lilac: "lilas",
  skyBlue: "bleu ciel",
  mint: "menthe",
};

const CUSTOM_COLOR_NAME = "couleur personnalisée";

export function formatColorName(color: string): string {
  const swatch = findSwatch(color);
  return swatch === undefined ? CUSTOM_COLOR_NAME : SWATCH_NAMES[swatch];
}

function formatColors(colors: PillDesign["colors"]): string {
  const names = colors.map(formatColorName);
  return names[0] === names[1] ? names[0] : names.join(" et ");
}

export function formatPillDescriptionParts(design: PillDesign): string[] {
  return [SHAPE_NAMES[design.shape], SIZE_NAMES[design.size], formatColors(design.colors)];
}

export function formatPillDescription(design: PillDesign): string {
  return capitalize(formatPillDescriptionParts(design).join(" · "));
}

export function formatShapeName(shape: PillShape): string {
  return capitalize(SHAPE_NAMES[shape]);
}

export function formatSizeName(size: PillSize): string {
  return capitalize(SIZE_NAMES[size]);
}

export function formatColorTitle(color: string): string {
  return capitalize(formatColorName(color));
}

export function findSwatch(color: string): PillSwatch | undefined {
  return (Object.keys(pillSwatches) as PillSwatch[]).find(
    (swatch) => pillSwatches[swatch].toLowerCase() === color.toLowerCase(),
  );
}
