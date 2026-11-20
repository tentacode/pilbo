import { useState } from "react";
import { View } from "react-native";

import { CalendarMonthHeader } from "@/features/calendar/components/CalendarMonthHeader";
import { CalendarWeekdays } from "@/features/calendar/components/CalendarWeekdays";
import { toCalendarWeeks } from "@/features/calendar/utils/monthGrid";
import { monthOf } from "@/features/calendar/utils/months";
import {
  canShowPreviousStartMonth,
  startDateDaysOf,
} from "@/features/pillbox/utils/startDatePicker";
import { StartDateCell } from "./StartDateCell";
import { useStyles } from "./StartDatePicker.styles";

type StartDatePickerProps = {
  startsOn: string;
  today: string;
  onChange: (startsOn: string) => void;
};

export function StartDatePicker({ startsOn, today, onChange }: StartDatePickerProps) {
  const styles = useStyles();
  const [month, setMonth] = useState(() => monthOf(startsOn < today ? today : startsOn));
  const weeks = toCalendarWeeks(startDateDaysOf(month, startsOn, today));

  return (
    <View style={styles.picker}>
      <CalendarMonthHeader
        month={month}
        canShowPreviousMonth={canShowPreviousStartMonth(month, startsOn, today)}
        canShowNextMonth
        onShowMonth={setMonth}
      />
      <CalendarWeekdays />
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((day, dayIndex) => (
              <View key={day?.localDate ?? `blank-${dayIndex}`} style={styles.slot}>
                {day ? <StartDateCell day={day} onPress={onChange} /> : null}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
