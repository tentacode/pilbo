import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { type IntakeRecurrence, type Weekday, WEEKLY_INTERVALS } from "@/domain/intake";

import {
  formatIntervalLabel,
  formatWeeklyIntervalAccessibilityLabel,
} from "@/features/pillbox/utils/recurrenceFormatters";
import { weeklyPreviewOf } from "@/features/pillbox/utils/weeklyPreview";
import { FormSection } from "./FormSection";
import { StartsOnField } from "./StartsOnField";
import { WeekdayPicker } from "./WeekdayPicker";
import { WeeklyPreview } from "./WeeklyPreview";

type WeekdayRecurrenceFieldsProps = {
  recurrence: IntakeRecurrence;
  today: Date;
  onDayPress: (day: Weekday) => void;
  onIntervalChange: (interval: number) => void;
  onStartsOnChange: (startsOn: string) => void;
};

export function WeekdayRecurrenceFields({
  recurrence,
  today,
  onDayPress,
  onIntervalChange,
  onStartsOnChange,
}: WeekdayRecurrenceFieldsProps) {
  const { t } = useTranslation("pillbox");
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const isWeekly = recurrence.frequency === "weekly";
  const intervalOptions = WEEKLY_INTERVALS.map((interval) => ({
    value: interval,
    label: formatIntervalLabel(t, interval),
    accessibilityLabel: formatWeeklyIntervalAccessibilityLabel(t, interval),
  }));

  return (
    <>
      <FormSection label={t("Quels jours ?")}>
        <WeekdayPicker selectedDays={recurrence.days} onDayPress={onDayPress} />
      </FormSection>
      {isWeekly ? (
        <>
          <FormSection label={t("Quelles semaines ?")}>
            <SegmentedControl
              options={intervalOptions}
              selectedValue={recurrence.interval}
              onChange={onIntervalChange}
              accessibilityLabel={t("Quelles semaines ?")}
            />
          </FormSection>
          <StartsOnField
            help={t("Les semaines se comptent à partir de cette date.")}
            startsOn={recurrence.startsOn}
            today={today}
            isExpanded={isCalendarExpanded}
            onToggle={() => setIsCalendarExpanded((isExpanded) => !isExpanded)}
            onChange={onStartsOnChange}
          />
          <FormSection label={t("Aperçu")}>
            <WeeklyPreview weeks={weeklyPreviewOf(recurrence, today)} />
          </FormSection>
        </>
      ) : null}
    </>
  );
}
