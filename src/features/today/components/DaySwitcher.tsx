import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Text } from "@/design-system/components/Text/Text";

import type { DayNavigation } from "@/features/today/hooks/useDayNavigation";
import {
  formatNextDayAccessibilityLabel,
  formatPreviousDayAccessibilityLabel,
  formatSwitcherDate,
} from "@/features/today/utils/formatters";
import { styles } from "./DaySwitcher.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type DaySwitcherProps = {
  dayNavigation: DayNavigation;
};

export function DaySwitcher({ dayNavigation }: DaySwitcherProps) {
  const { t } = useTranslation("today");
  const language = useLanguage();
  const { displayedDate, previousDate, nextDate, showDate } = dayNavigation;
  const date = formatSwitcherDate(displayedDate, language);

  return (
    <View style={styles.switcher}>
      <IconButton
        icon="chevronLeft"
        variant="plain"
        accessibilityLabel={formatPreviousDayAccessibilityLabel(
          t,
          previousDate ?? displayedDate,
          language,
        )}
        isDisabled={previousDate === null}
        onPress={() => previousDate && showDate(previousDate)}
      />
      <Text
        variant="small"
        tone="secondary"
        accessibilityLabel={date.accessibilityLabel}
        style={styles.date}
      >
        {date.text}
      </Text>
      {nextDate === null ? null : (
        <IconButton
          icon="chevronRight"
          variant="plain"
          accessibilityLabel={formatNextDayAccessibilityLabel(t, nextDate, language)}
          onPress={() => showDate(nextDate)}
        />
      )}
    </View>
  );
}
