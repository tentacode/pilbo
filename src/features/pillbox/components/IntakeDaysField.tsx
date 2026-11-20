import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";

import type { DayMode } from "@/features/pillbox/utils/intakeDraft";
import { FormSection } from "./FormSection";
import { IntakeRecurrenceRow } from "./IntakeRecurrenceRow";

type IntakeDaysFieldProps = {
  dayMode: DayMode;
  recurrence: string;
  nextIntake: string | null;
  onDayModeChange: (dayMode: DayMode) => void;
  onOpenRecurrence: () => void;
};

export function IntakeDaysField({
  dayMode,
  recurrence,
  nextIntake,
  onDayModeChange,
  onOpenRecurrence,
}: IntakeDaysFieldProps) {
  const { t } = useTranslation("pillbox");
  const dayModeOptions: { value: DayMode; label: string }[] = [
    { value: "everyDay", label: t("Tous les jours") },
    { value: "custom", label: t("Personnalisé") },
  ];

  function handleChange(value: DayMode) {
    onDayModeChange(value);
    if (value === "custom") {
      onOpenRecurrence();
    }
  }

  return (
    <FormSection label={t("Jours")}>
      <SegmentedControl
        options={dayModeOptions}
        selectedValue={dayMode}
        onChange={handleChange}
        accessibilityLabel={t("Jours")}
      />
      {dayMode === "custom" ? (
        <IntakeRecurrenceRow
          recurrence={recurrence}
          nextIntake={nextIntake}
          onPress={onOpenRecurrence}
        />
      ) : null}
    </FormSection>
  );
}
