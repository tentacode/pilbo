import { Pressable } from "react-native";

import { useReduceMotion } from "../../hooks/useReduceMotion";
import { playPressHaptic } from "../../utils/playPressHaptic";
import { Text } from "../Text/Text";
import { styles } from "./Button.styles";

type ButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
};

export function Button({ label, onPress, accessibilityHint }: ButtonProps) {
  const reduceMotion = useReduceMotion();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        pressed && !reduceMotion && styles.pressedScaled,
      ]}
    >
      <Text variant="bodyBold" tone="onInk" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}
