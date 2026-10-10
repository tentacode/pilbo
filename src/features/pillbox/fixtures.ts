import type { Intake } from "@/domain/intake";
import { WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";

const LAVENDER = "#D6C9F5";
const TURQUOISE = "#B3E8E0";
const ROSE = "#F8C6DA";
const BUTTER = "#FBE29A";
const DEEP_ROSE = "#F58FB8";
const WHITE = "#FFFFFF";

const lithium250: Med = {
  id: "lithium-250",
  name: "Lithium",
  strength: "250 mg",
  design: { shape: "round", color: LAVENDER, hasScoreLine: true, size: "medium" },
};

const lamictal50: Med = {
  id: "lamictal-50",
  name: "Lamictal",
  strength: "50 mg",
  design: {
    shape: "capsule",
    firstHalfColor: TURQUOISE,
    secondHalfColor: TURQUOISE,
    size: "small",
  },
};

const lamictal100: Med = {
  id: "lamictal-100",
  name: "Lamictal",
  strength: "100 mg",
  design: {
    shape: "capsule",
    firstHalfColor: TURQUOISE,
    secondHalfColor: TURQUOISE,
    size: "large",
  },
};

const quviviq50: Med = {
  id: "quviviq-50",
  name: "Quviviq",
  strength: "50 mg",
  design: { shape: "oval", color: ROSE, size: "medium" },
};

const pregabalin50: Med = {
  id: "pregabalin-50",
  name: "Prégabaline",
  strength: "50 mg",
  design: { shape: "round", color: BUTTER, hasScoreLine: false, size: "medium" },
};

export const hydroxyzine25: Med = {
  id: "hydroxyzine-25",
  name: "Hydroxyzine",
  strength: "25 mg",
  design: { shape: "capsule", firstHalfColor: DEEP_ROSE, secondHalfColor: WHITE, size: "medium" },
};

const EVERY_DAY = [...WEEKDAYS];
const REMINDER_INTERVAL_MINUTES = 10;

export const intakes: Intake[] = [
  {
    id: "morning",
    time: { hour: 8, minute: 20 },
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [
      { med: lithium250, quantity: 1 },
      { med: lamictal50, quantity: 1 },
    ],
  },
  {
    id: "noon",
    time: { hour: 12, minute: 20 },
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: lithium250, quantity: 1 }],
  },
  {
    id: "evening",
    time: { hour: 20, minute: 20 },
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [{ med: lithium250, quantity: 2 }],
  },
  {
    id: "night",
    time: { hour: 22, minute: 0 },
    days: EVERY_DAY,
    reminderIntervalMinutes: REMINDER_INTERVAL_MINUTES,
    medQuantities: [
      { med: lamictal100, quantity: 1 },
      { med: quviviq50, quantity: 1 },
      { med: pregabalin50, quantity: 1 },
    ],
  },
];
