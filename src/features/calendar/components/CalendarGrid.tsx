import { View } from "react-native";

import type { CalendarDay } from "@/features/calendar/utils/calendarTypes";
import { toCalendarWeeks } from "@/features/calendar/utils/monthGrid";
import { CalendarDayCell } from "./CalendarDayCell";
import { styles } from "./CalendarGrid.styles";

type CalendarGridProps = {
  days: CalendarDay[];
  onOpenDay: (localDate: string) => void;
};

export function CalendarGrid({ days, onOpenDay }: CalendarGridProps) {
  return (
    <View style={styles.grid}>
      {toCalendarWeeks(days).map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((day, dayIndex) => (
            <View key={day?.localDate ?? `blank-${dayIndex}`} style={styles.slot}>
              {day ? <CalendarDayCell day={day} onPress={onOpenDay} /> : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
