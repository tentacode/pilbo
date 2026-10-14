import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import { getPermissionGranted } from "@/features/notifications/notifications";

export function useRemindersEnabled(): boolean | null {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  const refresh = useCallback(() => {
    getPermissionGranted()
      .then(setIsEnabled)
      .catch((error: unknown) => console.error("Notification permission unreadable", error));
  }, []);

  useFocusEffect(refresh);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  return isEnabled;
}
