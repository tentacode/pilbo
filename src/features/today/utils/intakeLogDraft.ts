import type { Intake } from "@/domain/intake";
import { fromLocalDateTime, type IntakeLog } from "@/domain/intakeLog";

import type { EditedIntakeStatus } from "@/features/today/queries/saveIntakeLogChange";

export type IntakeLogDraft = {
  status: EditedIntakeStatus;
  takenTime: Intake["time"];
};

export function createIntakeLogDraft(intake: Intake, intakeLog?: IntakeLog): IntakeLogDraft {
  if (intakeLog?.status === "taken") {
    const takenAt = fromLocalDateTime(intakeLog.createdAt);
    return {
      status: "taken",
      takenTime: { hour: takenAt.getHours(), minute: takenAt.getMinutes() },
    };
  }
  return { status: intakeLog?.status ?? "none", takenTime: intake.time };
}

export function isIntakeLogDraftDirty(
  draft: IntakeLogDraft,
  initialDraft: IntakeLogDraft,
): boolean {
  if (draft.status !== initialDraft.status) {
    return true;
  }
  return (
    draft.status === "taken" &&
    (draft.takenTime.hour !== initialDraft.takenTime.hour ||
      draft.takenTime.minute !== initialDraft.takenTime.minute)
  );
}
