import { View } from "react-native";

import { useBottomSafeSpacing } from "../../hooks/useBottomSafeSpacing";
import { useStyles } from "./TabBar.styles";
import { TabBarItem, type TabBarItemProps } from "./TabBarItem";

type TabBarProps = {
  items: (TabBarItemProps & { key: string })[];
};

export function TabBar({ items }: TabBarProps) {
  const styles = useStyles();
  const bottomSafeSpacing = useBottomSafeSpacing();
  return (
    <View style={[styles.container, { paddingBottom: bottomSafeSpacing }]}>
      <View accessibilityRole="tablist" style={styles.bar}>
        {items.map(({ key, ...item }) => (
          <TabBarItem key={key} {...item} />
        ))}
      </View>
    </View>
  );
}
