import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import type { PillSize } from "@/domain/med";

import { formatSizeName } from "@/features/pillbox/utils/formatters";
import { FormSection } from "./FormSection";

const SIZES: PillSize[] = ["small", "medium", "large"];
const SIZE_OPTIONS = SIZES.map((size) => ({ value: size, label: formatSizeName(size) }));

type SizeFieldProps = {
  size: PillSize;
  onChange: (size: PillSize) => void;
};

export function SizeField({ size, onChange }: SizeFieldProps) {
  return (
    <FormSection label="Taille">
      <SegmentedControl
        options={SIZE_OPTIONS}
        selectedValue={size}
        onChange={onChange}
        accessibilityLabel="Taille"
      />
    </FormSection>
  );
}
