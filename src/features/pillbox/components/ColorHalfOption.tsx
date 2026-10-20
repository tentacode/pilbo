import { Pressable, View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";

import { formatColorName } from "@/features/pillbox/utils/formatters";
import { styles } from "./ColorHalfOption.styles";

type ColorHalfOptionProps = {
  label: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
};

export function ColorHalfOption({ label, color, isSelected, onPress }: ColorHalfOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${label} : ${formatColorName(color)}`}
      accessibilityState={{ selected: isSelected }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={[styles.option, isSelected && styles.selected]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        variant={isSelected ? "buttonSmall" : "callout"}
        tone={isSelected ? "primary" : "secondary"}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
}
