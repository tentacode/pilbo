import { Pressable } from "react-native";

import { colors, maximumFontScale, sizes } from "../../tokens";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text } from "../Text/Text";
import { styles } from "./TabBarItem.styles";

export type TabBarItemProps = {
  label: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
};

export function TabBarItem({ label, icon, selected, onPress }: TabBarItemProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.item, selected && styles.selected]}
    >
      <Icon name={icon} size={sizes.tabIcon} color={selected ? colors.ink : colors.inkSecondary} />
      <Text
        variant={selected ? "tabLabelSelected" : "tabLabel"}
        tone={selected ? "primary" : "secondary"}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        minimumFontScale={0.8}
        maxFontSizeMultiplier={maximumFontScale.tabLabel}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
}
