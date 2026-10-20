import { View } from "react-native";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { type Weekday, WEEKDAYS } from "@/domain/intake";

import type { DayMode } from "@/features/pillbox/utils/intakeDraft";
import { DayButton } from "./DayButton";
import { FormSection } from "./FormSection";
import { styles } from "./IntakeDaysField.styles";

const DAY_MODE_OPTIONS: { value: DayMode; label: string }[] = [
  { value: "everyDay", label: "Tous les jours" },
  { value: "someDays", label: "Certains jours" },
];

type IntakeDaysFieldProps = {
  dayMode: DayMode;
  selectedDays: Weekday[];
  onDayModeChange: (dayMode: DayMode) => void;
  onDayPress: (day: Weekday) => void;
};

export function IntakeDaysField({
  dayMode,
  selectedDays,
  onDayModeChange,
  onDayPress,
}: IntakeDaysFieldProps) {
  return (
    <FormSection label="Jours">
      <SegmentedControl
        options={DAY_MODE_OPTIONS}
        selectedValue={dayMode}
        onChange={onDayModeChange}
        accessibilityLabel="Jours"
      />
      <View style={styles.days}>
        {WEEKDAYS.map((day) => (
          <DayButton
            key={day}
            day={day}
            isSelected={selectedDays.includes(day)}
            onPress={() => onDayPress(day)}
          />
        ))}
      </View>
    </FormSection>
  );
}
