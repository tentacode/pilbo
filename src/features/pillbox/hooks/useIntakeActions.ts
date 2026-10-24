import { database } from "@/shared/database/database";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { archiveIntake } from "@/features/pillbox/queries/archiveIntake";
import { saveIntake } from "@/features/pillbox/queries/saveIntake";
import { type IntakeDraft, toIntakeToSave } from "@/features/pillbox/utils/intakeDraft";

export function rescheduleAfterChange() {
  rescheduleReminders(database, new Date()).catch((error: unknown) => {
    console.error(error);
  });
}

export function useIntakeActions() {
  return {
    save: (draft: IntakeDraft) => {
      saveIntake(database, toIntakeToSave(draft), new Date());
      rescheduleAfterChange();
    },
    archive: (intakeId: string) => {
      archiveIntake(database, intakeId, new Date());
      rescheduleAfterChange();
    },
  };
}
