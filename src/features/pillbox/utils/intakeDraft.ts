import { type Intake, type Weekday, WEEKDAYS } from "@/domain/intake";
import type { Med, MedQuantity } from "@/domain/med";

import type { IntakeToSave } from "@/features/pillbox/queries/saveIntake";

export type DayMode = "everyDay" | "someDays";

export type IntakeDraft = {
  intakeId?: string;
  time: Intake["time"];
  dayMode: DayMode;
  days: Weekday[];
  reminderIntervalMinutes: number;
  medQuantities: MedQuantity[];
};

const NEW_INTAKE_TIME = { hour: 8, minute: 0 };

function isEveryDay(days: Weekday[]): boolean {
  return WEEKDAYS.every((day) => days.includes(day));
}

export function createIntakeDraft(
  defaultReminderIntervalMinutes: number,
  intake?: Intake,
): IntakeDraft {
  if (intake === undefined) {
    return {
      time: NEW_INTAKE_TIME,
      dayMode: "everyDay",
      days: [...WEEKDAYS],
      reminderIntervalMinutes: defaultReminderIntervalMinutes,
      medQuantities: [],
    };
  }
  return {
    intakeId: intake.id,
    time: intake.time,
    dayMode: isEveryDay(intake.days) ? "everyDay" : "someDays",
    days: intake.days,
    reminderIntervalMinutes: intake.reminderIntervalMinutes,
    medQuantities: intake.medQuantities,
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

export function replaceDraftMed(medQuantities: MedQuantity[], med: Med): MedQuantity[] {
  return medQuantities.map((medQuantity) =>
    medQuantity.med.id === med.id ? { ...medQuantity, med } : medQuantity,
  );
}

export function draftSignature(draft: IntakeDraft): string {
  return JSON.stringify({
    time: draft.time,
    days: selectedDaysOf(draft),
    reminderIntervalMinutes: draft.reminderIntervalMinutes,
    medQuantities: draft.medQuantities.map(({ med, quantity }) => [med.id, quantity]),
  });
}

export function toIntakeToSave(draft: IntakeDraft): IntakeToSave {
  return {
    id: draft.intakeId,
    time: draft.time,
    days: selectedDaysOf(draft),
    reminderIntervalMinutes: draft.reminderIntervalMinutes,
    medQuantities: draft.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
  };
}
