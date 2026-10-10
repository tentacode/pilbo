import { Pressable } from "react-native";

import { colors, sizes } from "../../tokens";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { styles } from "./IconButton.styles";

type IconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
};

export function IconButton({ icon, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={icon} size={sizes.iconLarge} color={colors.onInk} />
    </Pressable>
  );
}
