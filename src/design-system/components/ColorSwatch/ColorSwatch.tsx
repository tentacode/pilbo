import { Pressable, View } from "react-native";

import { playPressHaptic } from "../../utils/playPressHaptic";
import { styles } from "./ColorSwatch.styles";

type ColorSwatchProps = {
  label: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
};

export function ColorSwatch({ label, color, isSelected, onPress }: ColorSwatchProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={[styles.swatch, isSelected && styles.selected]}
    >
      <View style={[styles.color, { backgroundColor: color }]} />
    </Pressable>
  );
}
