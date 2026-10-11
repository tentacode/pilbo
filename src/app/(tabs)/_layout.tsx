import { Tabs } from "expo-router";

import { NavigationTabBar } from "@/shared/navigation/NavigationTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="pillbox"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavigationTabBar {...props} />}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="pillbox" />
      <Tabs.Screen name="stocks" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
