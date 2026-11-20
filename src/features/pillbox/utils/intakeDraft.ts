import {
  DEFAULT_MONTHLY_INTERVAL,
  DEFAULT_WEEKLY_INTERVAL,
  type Intake,
  type IntakeFrequency,
  type IntakeRecurrence,
  isEveryDay,
  type Weekday,
  WEEKDAYS,
} from "@/domain/intake";
import { type Med, type MedQuantity, sortMedQuantities } from "@/domain/med";
import type { NotificationSound } from "@/domain/sound";

import type { IntakeToSave } from "@/features/pillbox/queries/saveIntake";

export type DayMode = "everyDay" | "custom";

export type IntakeDraft = IntakeRecurrence & {
  intakeId?: string;
  time: Intake["time"];
  dayMode: DayMode;
  reminderIntervalMinutes: number;
  sound: NotificationSound;
  medQuantities: MedQuantity[];
};

const NEW_INTAKE_TIME = { hour: 8, minute: 0 };

function everyDayRecurrence(startsOn: string): IntakeRecurrence {
  return { frequency: "daily", interval: 1, startsOn, days: [...WEEKDAYS] };
}

export function createIntakeDraft(
  defaultReminderIntervalMinutes: number,
  defaultReminderSound: NotificationSound,
  today: string,
  intake?: Intake,
): IntakeDraft {
  if (intake === undefined) {
    return {
      time: NEW_INTAKE_TIME,
      dayMode: "everyDay",
      ...everyDayRecurrence(today),
      reminderIntervalMinutes: defaultReminderIntervalMinutes,
      sound: defaultReminderSound,
      medQuantities: [],
    };
  }
  return {
    intakeId: intake.id,
    time: intake.time,
    dayMode: isEveryDay(intake) ? "everyDay" : "custom",
    frequency: intake.frequency,
    interval: intake.interval,
    startsOn: intake.startsOn,
    days: intake.days,
    reminderIntervalMinutes: intake.reminderIntervalMinutes,
    sound: intake.sound,
    medQuantities: sortMedQuantities(intake.medQuantities),
  };
}

function earliestDate(first: string, second: string): string {
  return first < second ? first : second;
}

export function withDayMode(
  draft: IntakeDraft,
  dayMode: DayMode,
  initialStartsOn: string,
  today: string,
): Partial<IntakeDraft> {
  if (dayMode === draft.dayMode) {
    return {};
  }
  return { dayMode, ...everyDayRecurrence(earliestDate(initialStartsOn, today)) };
}

export function withFrequency(
  { days }: IntakeDraft,
  frequency: IntakeFrequency,
  initialStartsOn: string,
  today: string,
): Partial<IntakeDraft> {
  const interval =
    frequency === "weekly"
      ? DEFAULT_WEEKLY_INTERVAL
      : frequency === "monthly"
        ? DEFAULT_MONTHLY_INTERVAL
        : 1;
  const hasNoDay = frequency !== "monthly" && days.length === 0;
  return {
    frequency,
    interval,
    ...(hasNoDay ? { days: [...WEEKDAYS] } : {}),
    ...(frequency === "daily" ? { startsOn: earliestDate(initialStartsOn, today) } : {}),
  };
}

export function recurrenceOf({
  frequency,
  interval,
  startsOn,
  days,
}: IntakeDraft): IntakeRecurrence {
  return { frequency, interval, startsOn, days };
}

export function toggleDay(days: Weekday[], day: Weekday): Weekday[] {
  return days.includes(day)
    ? days.filter((selectedDay) => selectedDay !== day)
    : WEEKDAYS.filter((weekday) => weekday === day || days.includes(weekday));
}

export function addDraftMed(
  medQuantities: MedQuantity[],
  med: Med,
  quantity: number,
): MedQuantity[] {
  return sortMedQuantities([...medQuantities, { med, quantity }]);
}

export function replaceDraftMed(medQuantities: MedQuantity[], med: Med): MedQuantity[] {
  return sortMedQuantities(
    medQuantities.map((medQuantity) =>
      medQuantity.med.id === med.id ? { ...medQuantity, med } : medQuantity,
    ),
  );
}

export function draftSignature(draft: IntakeDraft): string {
  return JSON.stringify({
    time: draft.time,
    ...recurrenceOf(draft),
    reminderIntervalMinutes: draft.reminderIntervalMinutes,
    sound: draft.sound,
    medQuantities: draft.medQuantities.map(({ med, quantity }) => [med.id, quantity]),
  });
}

export function toIntakeToSave(draft: IntakeDraft): IntakeToSave {
  return {
    id: draft.intakeId,
    time: draft.time,
    ...recurrenceOf(draft),
    reminderIntervalMinutes: draft.reminderIntervalMinutes,
    sound: draft.sound,
    medQuantities: draft.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
  };
}
