import { useWindowDimensions, View } from "react-native";

import { useFitsInWidth } from "@/design-system/hooks/useFitsInWidth";
import { sizes, spacing } from "@/design-system/tokens";
import { type Weekday, WEEKDAYS } from "@/domain/intake";

import { DayButton } from "./DayButton";
import { styles } from "./WeekdayPicker.styles";

const WEEK_DAYS_COUNT = 5;

type WeekdayPickerProps = {
  selectedDays: Weekday[];
  onDayPress: (day: Weekday) => void;
};

export function WeekdayPicker({ selectedDays, onDayPress }: WeekdayPickerProps) {
  const { fontScale } = useWindowDimensions();
  const diameter = Math.max(sizes.touchTarget, sizes.dayButton * fontScale);
  const requiredWidth = WEEKDAYS.length * diameter + (WEEKDAYS.length - 1) * spacing.dayButtonGap;
  const { onLayout, fits } = useFitsInWidth(requiredWidth);
  const rows = fits
    ? [WEEKDAYS]
    : [WEEKDAYS.slice(0, WEEK_DAYS_COUNT), WEEKDAYS.slice(WEEK_DAYS_COUNT)];

  return (
    <View onLayout={onLayout} style={styles.days}>
      {rows.map((row) => (
        <View key={row[0]} style={styles.row}>
          {row.map((day) => (
            <DayButton
              key={day}
              day={day}
              isSelected={selectedDays.includes(day)}
              diameter={diameter}
              onPress={() => onDayPress(day)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
