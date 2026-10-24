import type { TFunction } from "i18next";

import { WEEKDAYS } from "@/domain/intake";
import { fromLocalDate } from "@/domain/intakeLog";
import { capitalize, formatDayAndMonth, formatWeekday } from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import type { CalendarDay, DayStatus, Month } from "./calendarTypes";

function dateOf({ year, month }: Month): Date {
  return new Date(year, month, 1);
}

export function formatMonthTitle(month: Month, language: Language): string {
  return capitalize(
    new Intl.DateTimeFormat(language, { month: "long", year: "numeric" }).format(dateOf(month)),
  );
}

function formatMonthName(month: Month, language: Language): string {
  return new Intl.DateTimeFormat(language, { month: "long" }).format(dateOf(month));
}

export function formatPreviousMonthAccessibilityLabel(
  t: TFunction<"calendar">,
  month: Month,
  language: Language,
): string {
  return t("Mois précédent : {{month}}", { month: formatMonthName(month, language) });
}

export function formatNextMonthAccessibilityLabel(
  t: TFunction<"calendar">,
  month: Month,
  language: Language,
): string {
  return t("Mois suivant : {{month}}", { month: formatMonthName(month, language) });
}

export function formatWeekdayHeaders(language: Language): string[] {
  return WEEKDAYS.map((weekday) => formatWeekday(weekday, language, "short"));
}

export function formatDayStatus(t: TFunction<"calendar">, status: DayStatus): string {
  switch (status) {
    case "taken":
      return t("pris");
    case "late":
      return t("pris en retard");
    case "missed":
      return t("non pris");
    case "skipped":
      return t("ignoré");
    case "none":
      return t("aucune prise");
  }
}

export function formatCalendarDayAccessibilityLabel(
  t: TFunction<"calendar">,
  { localDate, status, isToday, isSelectable }: CalendarDay,
  language: Language,
): string {
  const date = formatDayAndMonth(fromLocalDate(localDate), language);
  if (!isSelectable) {
    return date;
  }
  if (isToday) {
    return status === "none"
      ? t("{{date}}, aujourd'hui", { date })
      : t("{{date}}, aujourd'hui : {{status}}", { date, status: formatDayStatus(t, status) });
  }
  return t("{{date}} : {{status}}", { date, status: formatDayStatus(t, status) });
}
