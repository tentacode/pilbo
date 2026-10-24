import { useEffect } from "react";
import { AppState } from "react-native";

import { database } from "@/shared/database/database";
import { i18n } from "@/shared/i18n/i18n";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";

function reschedule(): Promise<void> {
  return rescheduleReminders(database, new Date()).catch((error: unknown) => {
    console.error("Reminders could not be rescheduled", error);
  });
}

export function useReminderScheduling(isDatabaseReady: boolean): void {
  useEffect(() => {
    if (!isDatabaseReady) {
      return;
    }
    reschedule();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        reschedule();
      }
    });
    i18n.on("languageChanged", reschedule);
    return () => {
      subscription.remove();
      i18n.off("languageChanged", reschedule);
    };
  }, [isDatabaseReady]);
}
