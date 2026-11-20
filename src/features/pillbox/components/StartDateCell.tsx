import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import { maximumFontScale } from "@/design-system/tokens";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";
import { fromLocalDate } from "@/domain/intakeLog";

import type { StartDateDay } from "@/features/pillbox/utils/startDatePicker";
import { useStyles } from "./StartDateCell.styles";
import { formatFullDate } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type StartDateCellProps = {
  day: StartDateDay;
  onPress: (localDate: string) => void;
};

export function StartDateCell({ day, onPress }: StartDateCellProps) {
  const styles = useStyles();
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  const date = formatFullDate(fromLocalDate(day.localDate), language);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={day.isToday ? t("Aujourd'hui, {{date}}", { date }) : date}
      accessibilityState={{ selected: day.isSelected, disabled: !day.isSelectable }}
      disabled={!day.isSelectable}
      onPressIn={playPressHaptic}
      onPress={() => onPress(day.localDate)}
      style={({ pressed }) => [
        styles.cell,
        day.isToday && styles.today,
        day.isSelected && styles.selected,
        !day.isSelectable && !day.isSelected && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text
        variant={day.isSelected || day.isToday ? "buttonSmall" : "callout"}
        tone={day.isSelected ? "onInk" : day.isSelectable ? "primary" : "secondary"}
        maxFontSizeMultiplier={maximumFontScale.calendarGrid}
        style={styles.number}
      >
        {day.dayOfMonth}
      </Text>
    </Pressable>
  );
}
