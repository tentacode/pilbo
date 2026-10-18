import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import { database } from "@/shared/database/database";

import {
  getPermissionStatus,
  type PermissionStatus,
  requestPermission,
} from "@/features/notifications/notifications";
import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";

type NotificationPermission = {
  isGranted: boolean | null;
  request: () => Promise<void>;
};

async function askPermission(status: PermissionStatus): Promise<void> {
  if (status === "denied") {
    await Linking.openSettings();
    return;
  }
  if (status === "undetermined" && (await requestPermission())) {
    await rescheduleReminders(database, new Date()).catch((error: unknown) =>
      console.error("Reminders could not be rescheduled", error),
    );
  }
}

export function useNotificationPermission(): NotificationPermission {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await getPermissionStatus());
    } catch (error) {
      console.error("Notification permission unreadable", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  const request = useCallback(async () => {
    try {
      await askPermission(await getPermissionStatus());
    } catch (error) {
      console.error("Notification permission failed", error);
    }
    await refresh();
  }, [refresh]);

  return { isGranted: status === null ? null : status === "granted", request };
}
