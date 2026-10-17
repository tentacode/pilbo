import { WEEKDAYS } from "@/domain/intake";

import type { IntakeLogStatus } from "@/domain/intakeLog";

import type { NewIntakeRow, NewMedRow } from "./schema";

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
    design: { shape: "round", color: LAVENDER, hasScoreLine: true, size: "medium" },
  },
  lamictal50: {
    name: "Lamictal",
    strength: "50 mg",
    design: {
      shape: "capsule",
      firstHalfColor: TURQUOISE,
      secondHalfColor: TURQUOISE,
      size: "small",
    },
  },
  lamictal100: {
    name: "Lamictal",
    strength: "100 mg",
    design: {
      shape: "capsule",
      firstHalfColor: TURQUOISE,
      secondHalfColor: TURQUOISE,
      size: "large",
    },
  },
  quviviq50: {
    name: "Quviviq",
    strength: "50 mg",
    design: { shape: "oval", color: ROSE, size: "medium" },
  },
  pregabalin50: {
    name: "Prégabaline",
    strength: "50 mg",
    design: { shape: "round", color: BUTTER, hasScoreLine: false, size: "medium" },
  },
  prazepam25: {
    name: "Prazépam",
    strength: "25 mg",
    design: { shape: "capsule", firstHalfColor: DEEP_ROSE, secondHalfColor: WHITE, size: "medium" },
    isAsNeeded: true,
  },
} satisfies Record<string, NewMedRow>;

export type MedFixtureKey = keyof typeof medFixtures;

export interface IntakeFixture extends NewIntakeRow {
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

export const intakeLogFixture: {
  intake: IntakeFixture;
  status: IntakeLogStatus;
  minutesAfterExpected: number;
} = {
  intake: intakeFixtures[0],
  status: "taken",
  minutesAfterExpected: 75,
};
