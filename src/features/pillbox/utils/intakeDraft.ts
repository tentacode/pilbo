import { type Intake, type Weekday, WEEKDAYS } from "@/domain/intake";
import { type Med, type MedQuantity, sortMedQuantities } from "@/domain/med";
import type { NotificationSound } from "@/domain/sound";

import type { IntakeToSave } from "@/features/pillbox/queries/saveIntake";

export type DayMode = "everyDay" | "someDays";

export type IntakeDraft = {
  intakeId?: string;
  time: Intake["time"];
  dayMode: DayMode;
  days: Weekday[];
  reminderIntervalMinutes: number;
  sound: NotificationSound;
  medQuantities: MedQuantity[];
};

const NEW_INTAKE_TIME = { hour: 8, minute: 0 };

function isEveryDay(days: Weekday[]): boolean {
  return WEEKDAYS.every((day) => days.includes(day));
}

export function createIntakeDraft(
  defaultReminderIntervalMinutes: number,
  defaultReminderSound: NotificationSound,
  intake?: Intake,
): IntakeDraft {
  if (intake === undefined) {
    return {
      time: NEW_INTAKE_TIME,
      dayMode: "everyDay",
      days: [...WEEKDAYS],
      reminderIntervalMinutes: defaultReminderIntervalMinutes,
      sound: defaultReminderSound,
      medQuantities: [],
    };
  }
  return {
    intakeId: intake.id,
    time: intake.time,
    dayMode: isEveryDay(intake.days) ? "everyDay" : "someDays",
    days: intake.days,
    reminderIntervalMinutes: intake.reminderIntervalMinutes,
    sound: intake.sound,
    medQuantities: sortMedQuantities(intake.medQuantities),
  };
}

export function selectedDaysOf(draft: IntakeDraft): Weekday[] {
  return draft.dayMode === "everyDay" ? [...WEEKDAYS] : draft.days;
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
    days: selectedDaysOf(draft),
    reminderIntervalMinutes: draft.reminderIntervalMinutes,
    sound: draft.sound,
    medQuantities: draft.medQuantities.map(({ med, quantity }) => [med.id, quantity]),
  });
}

export function toIntakeToSave(draft: IntakeDraft): IntakeToSave {
  return {
    id: draft.intakeId,
    time: draft.time,
    days: selectedDaysOf(draft),
    reminderIntervalMinutes: draft.reminderIntervalMinutes,
    sound: draft.sound,
    medQuantities: draft.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
  };
}
