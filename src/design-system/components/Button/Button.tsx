import { type ColorValue, Pressable } from "react-native";

import { useReduceMotion } from "../../hooks/useReduceMotion";
import { colors } from "../../tokens";
import { playPressHaptic } from "../../utils/playPressHaptic";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text, type TextTone, type TextVariant } from "../Text/Text";
import { pressedVariantStyles, sizeStyles, styles, variantStyles } from "./Button.styles";

export type ButtonVariant = "primary" | "prominent" | "secondary" | "text";
export type ButtonSize = "regular" | "large";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  isDisabled?: boolean;
};

const ICON_COLORS: Record<ButtonVariant, ColorValue> = {
  primary: colors.onInk,
  prominent: colors.onProminent,
  secondary: colors.ink,
  text: colors.ink,
};

const LABEL_TONES: Record<ButtonVariant, TextTone> = {
  primary: "onInk",
  prominent: "onProminent",
  secondary: "primary",
  text: "primary",
};

function labelVariant(variant: ButtonVariant, size: ButtonSize): TextVariant {
  return variant === "secondary" && size === "regular" ? "buttonSmall" : "bodyBold";
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "regular",
  icon,
  accessibilityLabel,
  accessibilityHint,
  isDisabled = false,
}: ButtonProps) {
  const reduceMotion = useReduceMotion();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        pressed && pressedVariantStyles[variant],
        pressed && !reduceMotion && styles.pressedScaled,
        isDisabled && styles.disabled,
      ]}
    >
      {icon ? <Icon name={icon} color={ICON_COLORS[variant]} /> : null}
      <Text variant={labelVariant(variant, size)} tone={LABEL_TONES[variant]} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}
