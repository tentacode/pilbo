import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { IntakeLog, IntakeLogStatus } from "@/domain/intakeLog";

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

export function createIntakeLog(
  intake: Intake,
  status: IntakeLogStatus,
  createdAt: { hour: number; minute: number },
): IntakeLog {
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    id: `log-${intake.id}`,
    intakeId: intake.id,
    expectedIntakeAt: `2026-10-04T${pad(intake.time.hour)}:${pad(intake.time.minute)}`,
    createdAt: `2026-10-04T${pad(createdAt.hour)}:${pad(createdAt.minute)}`,
    status,
  };
}
