import { Pressable } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";
import type { Weekday } from "@/domain/intake";

import { formatDayInitials, formatDayName } from "@/features/pillbox/utils/formatters";
import { styles } from "./DayButton.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type DayButtonProps = {
  day: Weekday;
  isSelected: boolean;
  diameter: number;
  onPress: () => void;
};

export function DayButton({ day, isSelected, diameter, onPress }: DayButtonProps) {
  const language = useLanguage();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatDayName(day, language)}
      accessibilityState={{ selected: isSelected }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={[styles.button, { width: diameter, height: diameter }, isSelected && styles.selected]}
    >
      <Text variant="smallBold" tone={isSelected ? "onInk" : "primary"} style={styles.label}>
        {formatDayInitials(day, language)}
      </Text>
    </Pressable>
  );
}
