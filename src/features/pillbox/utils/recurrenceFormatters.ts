import type { TFunction } from "i18next";

import { type IntakeRecurrence, type Weekday, WEEKDAYS, weekdayOf } from "@/domain/intake";
import { addDays, fromLocalDate, toLocalDate } from "@/domain/intakeLog";
import {
  capitalize,
  formatDayAndMonth,
  formatDayOfMonth,
  formatLongDate,
  formatLongDateWithYear,
  formatShortDayAndMonth,
  formatShortWeekdayDayAndMonth,
  formatWeekday,
} from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import type { PreviewWeek } from "./weeklyPreview";

const FIRST_SHORTENED_DAY_OF_MONTH = 29;
const DAYS_PER_WEEK = 7;

export function formatList(t: TFunction<"pillbox">, items: string[]): string {
  if (items.length <= 1) {
    return items.join("");
  }
  return t("{{list}} et {{last}}", {
    list: items.slice(0, -1).join(", "),
    last: items[items.length - 1],
  });
}

export function formatWeekdays(
  t: TFunction<"pillbox">,
  language: Language,
  days: Weekday[],
): string {
  if (WEEKDAYS.every((day) => days.includes(day))) {
    return t("Tous les jours");
  }
  const names = WEEKDAYS.filter((day) => days.includes(day)).map((day) =>
    formatWeekday(day, language, "long"),
  );
  return capitalize(formatList(t, names));
}

function formatWeeklyRecurrence(t: TFunction<"pillbox">, days: string, interval: number): string {
  switch (interval) {
    case 2:
      return t("{{days}}, une semaine sur deux", { days });
    case 3:
      return t("{{days}}, une semaine sur trois", { days });
    case 4:
      return t("{{days}}, une semaine sur quatre", { days });
    default:
      return t("{{days}}, une semaine sur {{interval}}", { days, interval });
  }
}

function formatMonthlyRecurrence(t: TFunction<"pillbox">, day: string, interval: number): string {
  switch (interval) {
    case 1:
      return t("Le {{day}} de chaque mois", { day });
    case 2:
      return t("Le {{day}}, un mois sur deux", { day });
    case 3:
      return t("Le {{day}}, un mois sur trois", { day });
    case 6:
      return t("Le {{day}}, un mois sur six", { day });
    default:
      return t("Le {{day}}, un mois sur {{interval}}", { day, interval });
  }
}

export function formatStartDayOfMonth(startsOn: string, language: Language): string {
  return formatDayOfMonth(fromLocalDate(startsOn).getDate(), language);
}

export function formatRecurrence(
  t: TFunction<"pillbox">,
  language: Language,
  { frequency, interval, startsOn, days }: IntakeRecurrence,
): string {
  switch (frequency) {
    case "daily":
      return formatWeekdays(t, language, days);
    case "weekly":
      return formatWeeklyRecurrence(t, formatWeekdays(t, language, days), interval);
    case "monthly":
      return formatMonthlyRecurrence(t, formatStartDayOfMonth(startsOn, language), interval);
  }
}

export function formatDueDate(date: Date, today: Date, language: Language): string {
  return date.getFullYear() === today.getFullYear()
    ? formatLongDate(date, language)
    : formatLongDateWithYear(date, language);
}

export function formatNextIntake(
  t: TFunction<"pillbox">,
  language: Language,
  date: Date,
  today: Date,
): string {
  const localDate = toLocalDate(date);
  if (localDate === toLocalDate(today)) {
    return t("Prochaine : aujourd'hui");
  }
  if (localDate === toLocalDate(addDays(today, 1))) {
    return t("Prochaine : demain");
  }
  return t("Prochaine : {{date}}", { date: formatDueDate(date, today, language) });
}

export function formatStartsOn(
  t: TFunction<"pillbox">,
  language: Language,
  startsOn: string,
  today: Date,
): string {
  const date = formatDueDate(fromLocalDate(startsOn), today, language);
  return startsOn === toLocalDate(today)
    ? t("À partir d'aujourd'hui, {{date}}", { date })
    : t("À partir du {{date}}", { date });
}

export function formatStartsOnValue(
  t: TFunction<"pillbox">,
  language: Language,
  startsOn: string,
  today: Date,
): string {
  const date = fromLocalDate(startsOn);
  return startsOn === toLocalDate(today)
    ? t("Aujourd'hui, {{date}}", { date: formatShortDayAndMonth(date, language) })
    : formatShortWeekdayDayAndMonth(date, language);
}

export function formatStartsOnAccessibilityLabel(
  t: TFunction<"pillbox">,
  language: Language,
  startsOn: string,
  today: Date,
): string {
  const date = formatDueDate(fromLocalDate(startsOn), today, language);
  return startsOn === toLocalDate(today)
    ? t("Date de début : aujourd'hui, {{date}}", { date })
    : t("Date de début : {{date}}", { date });
}

export function isShortMonthsNoteNeeded(startsOn: string): boolean {
  return fromLocalDate(startsOn).getDate() >= FIRST_SHORTENED_DAY_OF_MONTH;
}

export function formatMonthlyHelp(
  t: TFunction<"pillbox">,
  language: Language,
  { startsOn, interval }: IntakeRecurrence,
  hasShortMonthsNote: boolean,
): string {
  const day = formatStartDayOfMonth(startsOn, language);
  const help =
    interval === 1
      ? t("Puis le {{day}} de chaque mois.", { day })
      : t("Puis le {{day}} du mois.", { day });
  return hasShortMonthsNote
    ? `${help} ${t("Le 29, 30 ou 31 : les mois plus courts, ce sera le dernier jour du mois.")}`
    : help;
}

function formatShortMonth(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(language, { month: "short" }).format(date);
}

export function formatWeekRange(monday: Date, language: Language): string {
  const sunday = addDays(monday, DAYS_PER_WEEK - 1);
  if (monday.getMonth() !== sunday.getMonth()) {
    return `${formatShortDayAndMonth(monday, language)}–${formatShortDayAndMonth(sunday, language)}`;
  }
  const days = `${monday.getDate()}–${sunday.getDate()}`;
  const month = formatShortMonth(monday, language);
  return language === "fr" ? `${days} ${month}` : `${month} ${days}`;
}

function formatPreviewWeek(
  t: TFunction<"pillbox">,
  language: Language,
  { monday, isActive, days }: PreviewWeek,
): string {
  const date = formatDayAndMonth(monday, language);
  if (!isActive) {
    return t("Semaine du {{date}} : pause", { date });
  }
  const dueDays = days
    .filter(({ isDue }) => isDue)
    .map(({ date: dueDate }) => formatWeekday(weekdayOf(dueDate), language, "long"));
  return dueDays.length === 0
    ? t("Semaine du {{date}} : aucune prise", { date })
    : t("Semaine du {{date}} : {{days}}", { date, days: formatList(t, dueDays) });
}

export function formatWeeklyPreviewAccessibilityLabel(
  t: TFunction<"pillbox">,
  language: Language,
  weeks: PreviewWeek[],
): string {
  return t("Aperçu : {{weeks}}", {
    weeks: weeks.map((week) => formatPreviewWeek(t, language, week)).join(". "),
  });
}

export function formatIntervalLabel(t: TFunction<"pillbox">, interval: number): string {
  return t("1 sur {{interval}}", { interval });
}

export function formatWeeklyIntervalAccessibilityLabel(
  t: TFunction<"pillbox">,
  interval: number,
): string {
  switch (interval) {
    case 2:
      return t("Une semaine sur deux");
    case 3:
      return t("Une semaine sur trois");
    case 4:
      return t("Une semaine sur quatre");
    default:
      return t("Une semaine sur {{interval}}", { interval });
  }
}

export function formatMonthlyIntervalAccessibilityLabel(
  t: TFunction<"pillbox">,
  interval: number,
): string {
  switch (interval) {
    case 1:
      return t("Tous les mois");
    case 2:
      return t("Un mois sur deux");
    case 3:
      return t("Un mois sur trois");
    case 6:
      return t("Un mois sur six");
    default:
      return t("Un mois sur {{interval}}", { interval });
  }
}
