import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";

import { FormSection } from "./FormSection";

const REMINDER_INTERVAL_OPTIONS = [5, 10, 15, 30].map((minutes) => ({
  value: minutes,
  label: `${minutes} min`,
  accessibilityLabel: `${minutes} minutes`,
}));

type ReminderIntervalFieldProps = {
  minutes: number;
  onChange: (minutes: number) => void;
};

export function ReminderIntervalField({ minutes, onChange }: ReminderIntervalFieldProps) {
  return (
    <FormSection
      label="Répéter le rappel toutes les"
      help="Jusqu’à ce que vous preniez ou ignoriez la prise."
    >
      <SegmentedControl
        options={REMINDER_INTERVAL_OPTIONS}
        selectedValue={minutes}
        onChange={onChange}
        accessibilityLabel="Intervalle des rappels"
      />
    </FormSection>
  );
}
