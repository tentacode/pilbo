import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { type IntakeRecurrence, MONTHLY_INTERVALS } from "@/domain/intake";
import { nextDueDates } from "@/domain/recurrence";

import {
  formatIntervalLabel,
  formatMonthlyHelp,
  formatMonthlyIntervalAccessibilityLabel,
  isShortMonthsNoteNeeded,
} from "@/features/pillbox/utils/recurrenceFormatters";
import { FormSection } from "./FormSection";
import { StartsOnField } from "./StartsOnField";
import { UpcomingIntakeList } from "./UpcomingIntakeList";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

const UPCOMING_INTAKE_COUNT = 4;

type MonthlyRecurrenceFieldsProps = {
  recurrence: IntakeRecurrence;
  today: Date;
  onIntervalChange: (interval: number) => void;
  onStartsOnChange: (startsOn: string) => void;
};

export function MonthlyRecurrenceFields({
  recurrence,
  today,
  onIntervalChange,
  onStartsOnChange,
}: MonthlyRecurrenceFieldsProps) {
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const intervalOptions = MONTHLY_INTERVALS.map((interval) => ({
    value: interval,
    label: interval === 1 ? t("Tous") : formatIntervalLabel(t, interval),
    accessibilityLabel: formatMonthlyIntervalAccessibilityLabel(t, interval),
  }));
  const hasShortMonthsNote = isCalendarExpanded || isShortMonthsNoteNeeded(recurrence.startsOn);

  return (
    <>
      <StartsOnField
        label={t("Quel jour du mois ?")}
        help={formatMonthlyHelp(t, language, recurrence, hasShortMonthsNote)}
        startsOn={recurrence.startsOn}
        today={today}
        isExpanded={isCalendarExpanded}
        onToggle={() => setIsCalendarExpanded((isExpanded) => !isExpanded)}
        onChange={onStartsOnChange}
      />
      <FormSection label={t("Quels mois ?")}>
        <SegmentedControl
          options={intervalOptions}
          selectedValue={recurrence.interval}
          onChange={onIntervalChange}
          accessibilityLabel={t("Quels mois ?")}
        />
      </FormSection>
      <FormSection label={t("Prochaines prises")}>
        <UpcomingIntakeList
          dates={nextDueDates(recurrence, today, UPCOMING_INTAKE_COUNT)}
          today={today}
        />
      </FormSection>
    </>
  );
}
