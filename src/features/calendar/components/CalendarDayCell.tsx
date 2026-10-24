import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { maximumFontScale, sizes } from "@/design-system/tokens";

import type { CalendarDay } from "@/features/calendar/utils/calendarTypes";
import { formatCalendarDayAccessibilityLabel } from "@/features/calendar/utils/formatters";
import { styles } from "./CalendarDayCell.styles";
import { DAY_STATUS_APPEARANCES, dayStatusStyles } from "./dayStatusAppearances";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type CalendarDayCellProps = {
  day: CalendarDay;
  onPress: (localDate: string) => void;
};

export function CalendarDayCell({ day, onPress }: CalendarDayCellProps) {
  const { t } = useTranslation("calendar");
  const language = useLanguage();
  const appearance = day.status === "none" ? null : DAY_STATUS_APPEARANCES[day.status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatCalendarDayAccessibilityLabel(t, day, language)}
      accessibilityState={{ disabled: !day.isSelectable }}
      disabled={!day.isSelectable}
      onPress={() => onPress(day.localDate)}
      style={({ pressed }) => [
        styles.cell,
        dayStatusStyles[day.status],
        day.isToday && dayStatusStyles.today,
        pressed && styles.pressed,
      ]}
    >
      <Text
        variant={day.isSelectable ? "buttonSmall" : "callout"}
        tone={appearance?.tone ?? (day.isSelectable ? "primary" : "secondary")}
        maxFontSizeMultiplier={maximumFontScale.calendarGrid}
        style={styles.number}
      >
        {day.dayOfMonth}
      </Text>
      {appearance ? (
        <Icon name={appearance.icon} size={sizes.iconSmall} color={appearance.color} />
      ) : null}
    </Pressable>
  );
}
