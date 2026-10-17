import type { BottomTabBarProps } from "expo-router/tabs";

import { TabBar } from "@/design-system/components/TabBar/TabBar";

import { tabs } from "./tabs";

type NavigationTabBarProps = BottomTabBarProps & {
  badgeCounts: Partial<Record<string, number>>;
};

export function NavigationTabBar({ state, navigation, badgeCounts }: NavigationTabBarProps) {
  const items = state.routes.map((route, index) => ({
    key: route.key,
    label: tabs[route.name].label,
    icon: tabs[route.name].icon,
    selected: state.index === index,
    badgeCount: badgeCounts[route.name],
    badgeAccessibilityLabel: tabs[route.name].formatBadgeLabel?.(badgeCounts[route.name] ?? 0),
    onPress: () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (state.index !== index && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    },
  }));
  return <TabBar items={items} />;
}
