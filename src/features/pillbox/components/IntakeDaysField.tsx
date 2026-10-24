import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { useFitsInWidth } from "@/design-system/hooks/useFitsInWidth";
import { sizes, spacing } from "@/design-system/tokens";
import { type Weekday, WEEKDAYS } from "@/domain/intake";

import type { DayMode } from "@/features/pillbox/utils/intakeDraft";
import { DayButton } from "./DayButton";
import { FormSection } from "./FormSection";
import { styles } from "./IntakeDaysField.styles";

const WEEK_DAYS_COUNT = 5;

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
  const { t } = useTranslation("pillbox");
  const { fontScale } = useWindowDimensions();
  const dayModeOptions: { value: DayMode; label: string }[] = [
    { value: "everyDay", label: t("Tous les jours") },
    { value: "someDays", label: t("Certains jours") },
  ];
  const diameter = Math.max(sizes.touchTarget, sizes.dayButton * fontScale);
  const requiredWidth = WEEKDAYS.length * diameter + (WEEKDAYS.length - 1) * spacing.dayButtonGap;
  const { onLayout, fits } = useFitsInWidth(requiredWidth);
  const rows = fits
    ? [WEEKDAYS]
    : [WEEKDAYS.slice(0, WEEK_DAYS_COUNT), WEEKDAYS.slice(WEEK_DAYS_COUNT)];

  return (
    <FormSection label={t("Jours")}>
      <SegmentedControl
        options={dayModeOptions}
        selectedValue={dayMode}
        onChange={onDayModeChange}
        accessibilityLabel={t("Jours")}
      />
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
    </FormSection>
  );
}
