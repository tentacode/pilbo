import { Pressable } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";
import type { Weekday } from "@/domain/intake";

import { formatDayInitials, formatDayName } from "@/features/pillbox/utils/formatters";
import { styles } from "./DayButton.styles";

type DayButtonProps = {
  day: Weekday;
  isSelected: boolean;
  onPress: () => void;
};

export function DayButton({ day, isSelected, onPress }: DayButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatDayName(day)}
      accessibilityState={{ selected: isSelected }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={[styles.button, isSelected && styles.selected]}
    >
      <Text variant="smallBold" tone={isSelected ? "onInk" : "primary"} style={styles.label}>
        {formatDayInitials(day)}
      </Text>
    </Pressable>
  );
}
