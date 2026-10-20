import { Pressable } from "react-native";

import { playPressHaptic } from "../../utils/playPressHaptic";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text } from "../Text/Text";
import { styles } from "./SheetNavigationButton.styles";

export type SheetAction = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  accessibilityLabel?: string;
  isStrong?: boolean;
};

export function SheetNavigationButton({
  label,
  onPress,
  icon,
  accessibilityLabel,
  isStrong = false,
}: SheetAction) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {icon ? <Icon name={icon} /> : null}
      <Text variant={isStrong ? "bodyBold" : "body"}>{label}</Text>
    </Pressable>
  );
}
