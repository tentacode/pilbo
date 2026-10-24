import { Pressable } from "react-native";

import { playPressHaptic } from "../../utils/playPressHaptic";
import { Icon } from "../Icon/Icon";
import { Text } from "../Text/Text";
import { styles } from "./BackButton.styles";

type BackButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function BackButton({ label, onPress, accessibilityLabel }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name="chevronLeft" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
