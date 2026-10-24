import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";

import { FormSection } from "@/features/pillbox/components/FormSection";
import type { EditedIntakeStatus } from "@/features/today/queries/saveIntakeLogChange";

type IntakeLogStatusFieldProps = {
  status: EditedIntakeStatus;
  onChange: (status: EditedIntakeStatus) => void;
};

export function IntakeLogStatusField({ status, onChange }: IntakeLogStatusFieldProps) {
  const { t } = useTranslation("today");
  return (
    <FormSection label={t("Statut")}>
      <SegmentedControl
        options={[
          { value: "taken", label: t("Prise") },
          { value: "skipped", label: t("Ignorée") },
          { value: "none", label: t("Supprimer") },
        ]}
        selectedValue={status}
        onChange={onChange}
        accessibilityLabel={t("Statut")}
      />
    </FormSection>
  );
}
