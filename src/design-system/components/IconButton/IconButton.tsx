import { Pressable } from "react-native";

import { colors, sizes } from "../../tokens";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { playPressHaptic } from "../../utils/playPressHaptic";
import { styles, variantStyles } from "./IconButton.styles";

export type IconButtonVariant = keyof typeof variantStyles;

type IconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  variant?: IconButtonVariant;
  isDisabled?: boolean;
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = "filled",
  isDisabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <Icon
        name={icon}
        size={sizes.iconLarge}
        color={variant === "filled" ? colors.onInk : colors.ink}
      />
    </Pressable>
  );
}
