import { Pressable } from "react-native";

import { useThemeColors } from "../../hooks/useThemeColors";
import { sizes } from "../../tokens";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { playPressHaptic } from "../../utils/playPressHaptic";
import { styles, useVariantStyles } from "./IconButton.styles";

export type IconButtonVariant = keyof ReturnType<typeof useVariantStyles>;

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
  const variantStyles = useVariantStyles();
  const themeColors = useThemeColors();
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
        color={variant === "filled" ? themeColors.onInk : themeColors.ink}
      />
    </Pressable>
  );
}
