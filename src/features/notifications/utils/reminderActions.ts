import type { IntakeLogStatus } from "@/domain/intakeLog";

export const REMINDER_CATEGORY_IDENTIFIER = "intake-reminder";

export const REMINDER_ACTION_IDENTIFIERS = {
  taken: "intake-reminder-taken",
  skipped: "intake-reminder-skipped",
} as const;

export type ReminderActionStatus = keyof typeof REMINDER_ACTION_IDENTIFIERS;

export type ReminderIntake = {
  intakeId: string;
  intakeDay: string;
};

export function reminderActionStatus(
  actionIdentifier: string | undefined,
): Extract<IntakeLogStatus, ReminderActionStatus> | undefined {
  const entry = Object.entries(REMINDER_ACTION_IDENTIFIERS).find(
    ([, identifier]) => identifier === actionIdentifier,
  );
  return entry?.[0] as ReminderActionStatus | undefined;
}

type ReminderContent = {
  data?: Record<string, unknown> | null;
  dataString?: unknown;
};

// The Android background task receives the raw content, where data is still a JSON string.
function contentDataOf({ data, dataString }: ReminderContent): Record<string, unknown> | undefined {
  if (data) {
    return data;
  }
  return typeof dataString === "string" ? JSON.parse(dataString) : undefined;
}

export function reminderIntakeOf(content: ReminderContent): ReminderIntake | undefined {
  const data = contentDataOf(content);
  const intakeId = data?.intakeId;
  const intakeDay = data?.intakeDay;
  if (typeof intakeId !== "string" || typeof intakeDay !== "string") {
    return undefined;
  }
  return { intakeId, intakeDay };
}
