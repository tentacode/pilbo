import { router } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { BackButton } from "@/design-system/components/BackButton/BackButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { Text } from "@/design-system/components/Text/Text";

import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarLegend } from "./components/CalendarLegend";
import { CalendarMonthHeader } from "./components/CalendarMonthHeader";
import { CalendarWeekdays } from "./components/CalendarWeekdays";
import { useCalendarData } from "./hooks/useCalendarData";
import { styles } from "./CalendarScreen.styles";

function openDay(localDate: string) {
  router.push(`/day/${localDate}`);
}

export function CalendarScreen() {
  const { t } = useTranslation("calendar");
  const { month, days, canShowPreviousMonth, canShowNextMonth, showMonth } = useCalendarData();

  return (
    <Screen>
      <View style={styles.header}>
        <BackButton label={t("Aujourd'hui")} onPress={() => router.back()} />
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          {t("Calendrier")}
        </Text>
      </View>
      <View style={styles.content}>
        <CalendarMonthHeader
          month={month}
          canShowPreviousMonth={canShowPreviousMonth}
          canShowNextMonth={canShowNextMonth}
          onShowMonth={showMonth}
        />
        <CalendarWeekdays />
        <CalendarGrid days={days} onOpenDay={openDay} />
        <CalendarLegend />
      </View>
    </Screen>
  );
}
