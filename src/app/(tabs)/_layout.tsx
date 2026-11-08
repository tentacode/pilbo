import { Tabs } from "expo-router";

import { useOpenTabOnNotification } from "@/features/notifications/hooks/useOpenTabOnNotification";
import { useLowStockCount } from "@/features/stocks/hooks/useLowStockCount";
import { usePendingPastIntakeCount } from "@/features/today/hooks/usePendingPastIntakeCount";
import { NavigationTabBar } from "@/shared/navigation/NavigationTabBar";

export default function TabsLayout() {
  useOpenTabOnNotification();
  const badgeCounts = { today: usePendingPastIntakeCount(), meds: useLowStockCount() };

  return (
    <Tabs
      initialRouteName="today"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavigationTabBar {...props} badgeCounts={badgeCounts} />}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="pillbox" />
      <Tabs.Screen name="meds" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
