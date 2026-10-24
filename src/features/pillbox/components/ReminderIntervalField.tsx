import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { useTranslation } from "react-i18next";

import { reminderIntervalOptions } from "../utils/reminderIntervalOptions";
import { FormSection } from "./FormSection";

type ReminderIntervalFieldProps = {
  minutes: number;
  onChange: (minutes: number) => void;
};

export function ReminderIntervalField({ minutes, onChange }: ReminderIntervalFieldProps) {
  const { t } = useTranslation("pillbox");
  const { t: translateCommon } = useTranslation("common");
  return (
    <FormSection
      label={t("Répéter le rappel toutes les")}
      help={t("Jusqu’à ce que vous preniez ou ignoriez la prise.")}
    >
      <SegmentedControl
        options={reminderIntervalOptions(translateCommon)}
        selectedValue={minutes}
        onChange={onChange}
        accessibilityLabel={t("Intervalle des rappels")}
      />
    </FormSection>
  );
}
