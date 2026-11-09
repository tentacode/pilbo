import { router } from "expo-router";
import { useState } from "react";

import type { NotificationSound } from "@/domain/sound";
import { database } from "@/shared/database/database";

import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";
import { hasActiveIntakeWithOtherSound } from "@/features/pillbox/queries/hasActiveIntakeWithOtherSound";
import { setAllActiveIntakesSound } from "@/features/pillbox/queries/setAllActiveIntakesSound";

import { useSettingsStore } from "../store/settingsStore";

function finish() {
  rescheduleAfterChange();
  router.back();
}

export function useDefaultReminderSound() {
  const defaultReminderSound = useSettingsStore((state) => state.defaultReminderSound);
  const setDefaultReminderSound = useSettingsStore((state) => state.setDefaultReminderSound);
  const [pendingSound, setPendingSound] = useState<NotificationSound | null>(null);

  return {
    defaultReminderSound,
    isApplyDialogVisible: pendingSound !== null,
    confirm: (sound: NotificationSound) => {
      setDefaultReminderSound(sound);
      if (hasActiveIntakeWithOtherSound(database, sound)) {
        setPendingSound(sound);
        return;
      }
      finish();
    },
    applyToAllIntakes: () => {
      if (pendingSound !== null) {
        setAllActiveIntakesSound(database, pendingSound);
      }
      setPendingSound(null);
      finish();
    },
    keepForNewIntakes: () => {
      setPendingSound(null);
      finish();
    },
  };
}
