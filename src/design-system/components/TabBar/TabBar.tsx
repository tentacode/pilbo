import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../../tokens";
import { styles } from "./TabBar.styles";
import { TabBarItem, type TabBarItemProps } from "./TabBarItem";

type TabBarProps = {
  items: (TabBarItemProps & { key: string })[];
};

export function TabBar({ items }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.large) }]}>
      <View accessibilityRole="tablist" style={styles.bar}>
        {items.map(({ key, ...item }) => (
          <TabBarItem key={key} {...item} />
        ))}
      </View>
    </View>
  );
}
