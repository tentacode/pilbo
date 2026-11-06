import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import type { PillSize } from "@/domain/med";
import { useTranslation } from "react-i18next";

import { formatSizeName } from "@/features/pillbox/utils/formatters";
import { pillSizes } from "@/features/pillbox/utils/pillDesign";
import { FormSection } from "./FormSection";

type SizeFieldProps = {
  size: PillSize;
  onChange: (size: PillSize) => void;
};

export function SizeField({ size, onChange }: SizeFieldProps) {
  const { t } = useTranslation("pillbox");
  const sizeOptions = pillSizes().map((value) => ({ value, label: formatSizeName(t, value) }));
  return (
    <FormSection label={t("Taille")}>
      <SegmentedControl
        options={sizeOptions}
        selectedValue={size}
        onChange={onChange}
        accessibilityLabel={t("Taille")}
      />
    </FormSection>
  );
}
