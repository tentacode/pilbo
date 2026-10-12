import { type Intake, WEEKDAYS } from "@/domain/intake";

export function createIntake(hour: number, minute: number): Intake {
  return {
    id: `intake-${hour}-${minute}`,
    time: { hour, minute },
    days: [...WEEKDAYS],
    reminderIntervalMinutes: 10,
    medQuantities: [
      {
        med: {
          id: `med-${hour}-${minute}`,
          name: "Lithium",
          strength: "250 mg",
          design: { shape: "round", color: "#D6C9F5", hasScoreLine: true, size: "medium" },
          isAsNeeded: false,
        },
        quantity: 1,
      },
    ],
  };
}

export function createDate(hour: number, minute: number): Date {
  return new Date(2026, 9, 4, hour, minute);
}
