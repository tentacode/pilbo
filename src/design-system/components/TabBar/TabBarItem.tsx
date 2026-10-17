import { Pressable, View } from "react-native";

import { colors, maximumFontScale, sizes } from "../../tokens";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text } from "../Text/Text";
import { styles } from "./TabBarItem.styles";

export type TabBarItemProps = {
  label: string;
  icon: IconName;
  selected: boolean;
  badgeCount?: number;
  badgeAccessibilityLabel?: string;
  onPress: () => void;
};

export function TabBarItem({
  label,
  icon,
  selected,
  badgeCount = 0,
  badgeAccessibilityLabel,
  onPress,
}: TabBarItemProps) {
  const hasBadge = badgeCount > 0;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={
        hasBadge && badgeAccessibilityLabel ? `${label}, ${badgeAccessibilityLabel}` : label
      }
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.item, selected && styles.selected]}
    >
      <View>
        <Icon
          name={icon}
          size={sizes.tabIcon}
          color={selected ? colors.ink : colors.inkSecondary}
        />
        {hasBadge ? (
          <View style={styles.badge}>
            <Text
              variant="tabLabelSelected"
              tone="onInk"
              maxFontSizeMultiplier={maximumFontScale.tabLabel}
            >
              {badgeCount}
            </Text>
          </View>
        ) : null}
      </View>
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
