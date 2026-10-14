import { useEffect } from "react";
import { AppState } from "react-native";

import { database } from "@/shared/database/database";

import { requestPermission } from "@/features/notifications/notifications";
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
    requestPermission()
      .catch((error: unknown) => console.error("Notification permission failed", error))
      .finally(reschedule);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        reschedule();
      }
    });
    return () => subscription.remove();
  }, [isDatabaseReady]);
}
