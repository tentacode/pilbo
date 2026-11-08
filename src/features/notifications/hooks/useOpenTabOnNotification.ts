import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

import { useTabResetStore } from "@/shared/navigation/tabResetStore";

import { notificationTab } from "@/features/notifications/utils/notificationTab";

const TAB_HREFS = { today: "/today", meds: "/meds" } as const;

export function useOpenTabOnNotification(): void {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const tab = notificationTab(response.notification.request.identifier);
      router.navigate(TAB_HREFS[tab]);
      useTabResetStore.getState().requestTabReset(tab);
    });
    return () => subscription.remove();
  }, []);
}
