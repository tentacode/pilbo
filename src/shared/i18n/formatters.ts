import { getCalendars } from "expo-localization";

import type { Intake, Weekday } from "@/domain/intake";
import { WEEKDAYS } from "@/domain/intake";

import type { Language } from "./resources";

const FIRST_MONDAY_OF_2024 = new Date(2024, 0, 1);

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function uses24HourClock(): boolean {
  return getCalendars()[0]?.uses24hourClock ?? true;
}

export function formatIntakeTime(
  { hour, minute }: Intake["time"],
  is24HourClock: boolean = uses24HourClock(),
): string {
  const paddedMinute = String(minute).padStart(2, "0");
  if (is24HourClock) {
    return `${String(hour).padStart(2, "0")}:${paddedMinute}`;
  }
  return `${hour % 12 === 0 ? 12 : hour % 12}:${paddedMinute} ${hour < 12 ? "AM" : "PM"}`;
}

function dateOfWeekday(weekday: Weekday): Date {
  const date = new Date(FIRST_MONDAY_OF_2024);
  date.setDate(date.getDate() + WEEKDAYS.indexOf(weekday));
  return date;
}

export function formatWeekday(
  weekday: Weekday,
  language: Language,
  width: "long" | "short",
): string {
  const name = new Intl.DateTimeFormat(language, { weekday: width }).format(dateOfWeekday(weekday));
  return name.replace(/\.$/, "");
}

function withFrenchFirstDay(text: string, date: Date, language: Language): string {
  return language === "fr" && date.getDate() === 1 ? text.replace(/\b1 /, "1er ") : text;
}

export function formatDayAndMonth(date: Date, language: Language): string {
  if (language === "fr" && date.getDate() === 1) {
    const month = new Intl.DateTimeFormat(language, { month: "long" }).format(date);
    return `1er ${month}`;
  }
  return new Intl.DateTimeFormat(language, { day: "numeric", month: "long" }).format(date);
}

export function formatShortDate(date: Date, language: Language): string {
  const text = new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
  return language === "fr" && date.getDate() === 1 ? text.replace(/^1 /, "1er ") : text;
}

export function formatLongDateWithYear(date: Date, language: Language): string {
  const text = new Intl.DateTimeFormat(language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return withFrenchFirstDay(text, date, language);
}

export function formatLongDate(date: Date, language: Language): string {
  const text = new Intl.DateTimeFormat(language, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return withFrenchFirstDay(text, date, language);
}

export function formatFullDate(date: Date, language: Language): string {
  return capitalize(formatLongDate(date, language));
}

export function formatShortDayAndMonth(date: Date, language: Language): string {
  const text = new Intl.DateTimeFormat(language, { day: "numeric", month: "short" }).format(date);
  return withFrenchFirstDay(text, date, language);
}

export function formatShortWeekdayDayAndMonth(date: Date, language: Language): string {
  const text = new Intl.DateTimeFormat(language, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
  return capitalize(withFrenchFirstDay(text, date, language));
}

const ENGLISH_ORDINAL_SUFFIXES: Partial<Record<number, string>> = { 1: "st", 2: "nd", 3: "rd" };

export function formatDayOfMonth(day: number, language: Language): string {
  if (language === "fr") {
    return day === 1 ? "1er" : String(day);
  }
  const lastTwoDigits = day % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${day}th`;
  }
  return `${day}${ENGLISH_ORDINAL_SUFFIXES[day % 10] ?? "th"}`;
}
