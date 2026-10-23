import { Pressable } from "react-native";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";
import type { PillDesign } from "@/domain/med";

import { formatShapeName } from "@/features/pillbox/utils/formatters";
import { styles } from "./ShapeOption.styles";

type ShapeOptionProps = {
  design: PillDesign;
  isSelected: boolean;
  onPress: () => void;
};

export function ShapeOption({ design, isSelected, onPress }: ShapeOptionProps) {
  const label = formatShapeName(design.shape);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={[styles.option, isSelected && styles.selected]}
    >
      <Pill design={design} displaySize={sizes.pillShapeOption} />
      <Text
        variant={isSelected ? "helpBold" : "help"}
        tone={isSelected ? "primary" : "secondary"}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
}
