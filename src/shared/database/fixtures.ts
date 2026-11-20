import { type Weekday, WEEKDAYS } from "@/domain/intake";

import type { IntakeLogStatus } from "@/domain/intakeLog";

import type { NewIntakeRow, NewMedRow, NewStockRow } from "./schema";

const LAVENDER = "#D6C9F5";
const TURQUOISE = "#B3E8E0";
const ROSE = "#F8C6DA";
const BUTTER = "#FBE29A";
const DEEP_ROSE = "#F58FB8";
const WHITE = "#FFFFFF";

export const medFixtures = {
  magnesium300: {
    name: "Magnésium",
    strength: "300 mg",
    detail: "Avec le repas",
    design: { shape: "round", colors: [LAVENDER, LAVENDER], size: "medium" },
  },
  vitaminD400: {
    name: "Vitamine D",
    strength: "400 UI",
    design: { shape: "capsule", colors: [TURQUOISE, TURQUOISE], size: "small" },
  },
  vitaminD1000: {
    name: "Vitamine D",
    strength: "1000 UI",
    design: { shape: "capsule", colors: [TURQUOISE, TURQUOISE], size: "large" },
  },
  melatonin1: {
    name: "Mélatonine",
    strength: "1 mg",
    design: { shape: "syrup", colors: [ROSE, WHITE], size: "medium" },
  },
  vitaminB12: {
    name: "Vitamine B12",
    strength: "1000 µg",
    design: { shape: "drops", colors: [ROSE, ROSE], size: "small" },
  },
  iron80: {
    name: "Fer",
    strength: "80 mg",
    design: { shape: "sachet", colors: [BUTTER, BUTTER], size: "medium" },
  },
  paracetamol500: {
    name: "Paracétamol",
    strength: "500 mg",
    detail: "Si besoin",
    design: { shape: "capsule", colors: [DEEP_ROSE, WHITE], size: "medium" },
  },
} satisfies Record<string, NewMedRow>;

export type MedFixtureKey = keyof typeof medFixtures;

export interface IntakeFixture extends Omit<NewIntakeRow, "createdOn" | "startsOn" | "days"> {
  days: Weekday[];
  medQuantities: { med: MedFixtureKey; quantity: number }[];
}

const EVERY_DAY = [...WEEKDAYS];
const REMINDER_INTERVAL_MINUTES = 10;

export const intakeFixtures: IntakeFixture[] = [
  {
    hour: 8,
    minute: 20,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [
      { med: "magnesium300", quantity: 1 },
      { med: "vitaminD400", quantity: 1 },
    ],
  },
  {
    hour: 12,
    minute: 20,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: "magnesium300", quantity: 1 }],
  },
  {
    hour: 20,
    minute: 20,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: "magnesium300", quantity: 2 }],
  },
  {
    hour: 22,
    minute: 0,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    sound: "nocturne",
    medQuantities: [
      { med: "vitaminD1000", quantity: 1 },
      { med: "melatonin1", quantity: 1 },
      { med: "iron80", quantity: 1 },
    ],
  },
  {
    hour: 9,
    minute: 0,
    days: [],
    frequency: "monthly",
    interval: 1,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: "vitaminB12", quantity: 1 }],
  },
  {
    hour: 19,
    minute: 30,
    days: EVERY_DAY,
    frequency: "weekly",
    interval: 2,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: "melatonin1", quantity: 1 }],
  },
];

export interface StockFixture extends Omit<NewStockRow, "medId"> {
  med: MedFixtureKey;
}

export const stockFixtures: StockFixture[] = [
  { med: "magnesium300", quantity: 18, boxSize: 100, lowStockDays: 7 },
  { med: "vitaminD400", quantity: 45, boxSize: 50, lowStockDays: 7 },
  { med: "vitaminD1000", quantity: 56, boxSize: 60, lowStockDays: 7 },
  { med: "paracetamol500", quantity: 15, boxSize: 20, lowStockDays: 7 },
];

export const HISTORY_DAYS = 45;

export const WEEKLY_START_WEEKS_AGO = 6;

export const intakeVersionFixture = {
  intake: intakeFixtures[1],
  previousTime: { hour: 12, minute: 0 },
  daysAgo: 10,
};

export type HistoryDayKind =
  "late" | "partlyForgotten" | "markedForgotten" | "allSkipped" | "allForgotten";

export const historyDayFixtures: Record<number, HistoryDayKind> = {
  3: "late",
  6: "allSkipped",
  9: "allForgotten",
  12: "late",
  15: "partlyForgotten",
  18: "markedForgotten",
  20: "late",
  27: "partlyForgotten",
  33: "late",
};

export const historyLogFixture = {
  minutesAfterExpected: 5,
  lateMinutesAfterExpected: 95,
};

export const medLogFixture: { med: MedFixtureKey; daysAgo: number[]; time: string } = {
  med: "paracetamol500",
  daysAgo: [2, 5, 14, 21, 30],
  time: "15:40",
};

export const intakeLogFixture: {
  intake: IntakeFixture;
  status: IntakeLogStatus;
  minutesAfterExpected: number;
} = {
  intake: intakeFixtures[0],
  status: "taken",
  minutesAfterExpected: 75,
};
