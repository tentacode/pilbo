import { WEEKDAYS } from "@/domain/intake";

import type { IntakeLogStatus } from "@/domain/intakeLog";

import type { NewIntakeRow, NewMedRow, NewStockRow } from "./schema";

const LAVENDER = "#D6C9F5";
const TURQUOISE = "#B3E8E0";
const ROSE = "#F8C6DA";
const BUTTER = "#FBE29A";
const DEEP_ROSE = "#F58FB8";
const WHITE = "#FFFFFF";

export const medFixtures = {
  lithium250: {
    name: "Lithium",
    strength: "250 mg",
    detail: "Avec le repas",
    design: { shape: "round", colors: [LAVENDER, LAVENDER], size: "medium" },
  },
  lamictal50: {
    name: "Lamictal",
    strength: "50 mg",
    design: { shape: "capsule", colors: [TURQUOISE, TURQUOISE], size: "small" },
  },
  lamictal100: {
    name: "Lamictal",
    strength: "100 mg",
    design: { shape: "capsule", colors: [TURQUOISE, TURQUOISE], size: "large" },
  },
  quviviq50: {
    name: "Quviviq",
    strength: "50 mg",
    design: { shape: "softgel", colors: [ROSE, ROSE], size: "medium" },
  },
  pregabalin50: {
    name: "Prégabaline",
    strength: "50 mg",
    design: { shape: "oval", colors: [BUTTER, BUTTER], size: "medium" },
  },
  prazepam25: {
    name: "Prazépam",
    strength: "25 mg",
    detail: "Si besoin",
    design: { shape: "capsule", colors: [DEEP_ROSE, WHITE], size: "medium" },
    isAsNeeded: true,
  },
} satisfies Record<string, NewMedRow>;

export type MedFixtureKey = keyof typeof medFixtures;

export interface IntakeFixture extends Omit<NewIntakeRow, "createdOn"> {
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
      { med: "lithium250", quantity: 1 },
      { med: "lamictal50", quantity: 1 },
    ],
  },
  {
    hour: 12,
    minute: 20,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: "lithium250", quantity: 1 }],
  },
  {
    hour: 20,
    minute: 20,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: "lithium250", quantity: 2 }],
  },
  {
    hour: 22,
    minute: 0,
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [
      { med: "lamictal100", quantity: 1 },
      { med: "quviviq50", quantity: 1 },
      { med: "pregabalin50", quantity: 1 },
    ],
  },
];

export interface StockFixture extends Omit<NewStockRow, "medId"> {
  med: MedFixtureKey;
}

export const stockFixtures: StockFixture[] = [
  { med: "lithium250", quantity: 18, boxSize: 100, lowStockDays: 7 },
  { med: "lamictal50", quantity: 45, boxSize: 50, lowStockDays: 7 },
  { med: "lamictal100", quantity: 56, boxSize: 60, lowStockDays: 7 },
];

export const HISTORY_DAYS = 45;

export const intakeVersionFixture = {
  intake: intakeFixtures[1],
  previousTime: { hour: 12, minute: 0 },
  daysAgo: 10,
};

export type HistoryDayKind = "late" | "partlyForgotten" | "allSkipped" | "allForgotten";

export const historyDayFixtures: Record<number, HistoryDayKind> = {
  3: "late",
  6: "allSkipped",
  9: "allForgotten",
  12: "late",
  15: "partlyForgotten",
  20: "late",
  27: "partlyForgotten",
  33: "late",
};

export const historyLogFixture = {
  minutesAfterExpected: 5,
  lateMinutesAfterExpected: 95,
};

export const asNeededLogFixture: { med: MedFixtureKey; daysAgo: number[]; time: string } = {
  med: "prazepam25",
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
