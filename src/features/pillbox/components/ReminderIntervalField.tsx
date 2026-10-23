import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";

import { REMINDER_INTERVAL_OPTIONS } from "../utils/reminderIntervalOptions";
import { FormSection } from "./FormSection";

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
