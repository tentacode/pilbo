import { router } from "expo-router";
import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";
import { useTabReset } from "@/shared/navigation/useTabReset";

import { PastDayContent } from "./components/PastDayContent";
import { TodayContent } from "./components/TodayContent";
import { TodayHeader } from "./components/TodayHeader";
import { useDayNavigation } from "@/features/today/hooks/useDayNavigation";
import { styles } from "./TodayScreen.styles";

function openCalendar() {
  router.push("/today/calendar");
}

export function TodayScreen() {
  const dayNavigation = useDayNavigation();
  const scrollViewReference = useTabReset("today", () =>
    dayNavigation.showDate(dayNavigation.today),
  );

  return (
    <Screen ref={scrollViewReference}>
      <TodayHeader dayNavigation={dayNavigation} onOpenCalendar={openCalendar} />
      <View style={styles.content}>
        {dayNavigation.isToday ? (
          <TodayContent />
        ) : (
          <PastDayContent localDate={dayNavigation.displayedDate} />
        )}
      </View>
    </Screen>
  );
}
