import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { maximumFontScale } from "@/design-system/tokens";

import { formatWeekdayHeaders } from "@/features/calendar/utils/formatters";
import { styles } from "./CalendarWeekdays.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

export function CalendarWeekdays() {
  const language = useLanguage();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.weekdays}
    >
      {formatWeekdayHeaders(language).map((weekday) => (
        <Text
          key={weekday}
          variant="helpBold"
          tone="secondary"
          maxFontSizeMultiplier={maximumFontScale.calendarGrid}
          style={styles.weekday}
        >
          {weekday}
        </Text>
      ))}
    </View>
  );
}
