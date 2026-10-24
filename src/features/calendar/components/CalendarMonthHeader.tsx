import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Text } from "@/design-system/components/Text/Text";

import type { Month } from "@/features/calendar/utils/calendarTypes";
import {
  formatMonthTitle,
  formatNextMonthAccessibilityLabel,
  formatPreviousMonthAccessibilityLabel,
} from "@/features/calendar/utils/formatters";
import { shiftMonth } from "@/features/calendar/utils/months";
import { styles } from "./CalendarMonthHeader.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type CalendarMonthHeaderProps = {
  month: Month;
  canShowPreviousMonth: boolean;
  canShowNextMonth: boolean;
  onShowMonth: (month: Month) => void;
};

export function CalendarMonthHeader({
  month,
  canShowPreviousMonth,
  canShowNextMonth,
  onShowMonth,
}: CalendarMonthHeaderProps) {
  const { t } = useTranslation("calendar");
  const language = useLanguage();
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);

  return (
    <View style={styles.header}>
      <Text variant="mediumHeading" accessibilityRole="header" style={styles.title}>
        {formatMonthTitle(month, language)}
      </Text>
      <View style={styles.navigation}>
        <IconButton
          icon="chevronLeft"
          variant="soft"
          accessibilityLabel={formatPreviousMonthAccessibilityLabel(t, previousMonth, language)}
          isDisabled={!canShowPreviousMonth}
          onPress={() => onShowMonth(previousMonth)}
        />
        <IconButton
          icon="chevronRight"
          variant="soft"
          accessibilityLabel={formatNextMonthAccessibilityLabel(t, nextMonth, language)}
          isDisabled={!canShowNextMonth}
          onPress={() => onShowMonth(nextMonth)}
        />
      </View>
    </View>
  );
}
