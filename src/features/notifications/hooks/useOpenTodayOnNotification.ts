import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export function useOpenTodayOnNotification(): void {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      router.navigate("/today");
    });
    return () => subscription.remove();
  }, []);
}
