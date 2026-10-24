import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Text } from "@/design-system/components/Text/Text";
import { spacing } from "@/design-system/tokens";

import type { DayNavigation } from "@/features/today/hooks/useDayNavigation";
import { formatDayTitle } from "@/features/today/utils/formatters";
import { DaySwitcher } from "./DaySwitcher";
import { styles } from "./TodayHeader.styles";
import { TodayHeaderDecoration } from "./TodayHeaderDecoration";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type TodayHeaderProps = {
  dayNavigation: DayNavigation;
  onOpenCalendar: () => void;
};

export function TodayHeader({ dayNavigation, onOpenCalendar }: TodayHeaderProps) {
  const { t } = useTranslation("today");
  const language = useLanguage();
  const insets = useSafeAreaInsets();
  const { today, displayedDate, isToday, showDate } = dayNavigation;

  return (
    <View style={styles.header}>
      <View style={[styles.decoration, { top: -(insets.top + spacing.medium) }]}>
        <TodayHeaderDecoration />
      </View>
      <View style={styles.row}>
        <DaySwitcher dayNavigation={dayNavigation} />
        <IconButton
          icon="calendar"
          variant="soft"
          accessibilityLabel={t("Calendrier")}
          onPress={onOpenCalendar}
        />
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {formatDayTitle(t, displayedDate, today, language)}
      </Text>
      {isToday ? null : (
        <View style={styles.todayLink}>
          <Button
            label={t("Revenir à aujourd'hui")}
            variant="text"
            onPress={() => showDate(today)}
          />
        </View>
      )}
    </View>
  );
}
