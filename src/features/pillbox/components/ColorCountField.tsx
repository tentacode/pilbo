import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { useTranslation } from "react-i18next";

import type { ColorCount } from "@/features/pillbox/utils/pillDesign";

type ColorCountFieldProps = {
  colorCount: ColorCount;
  onChange: (colorCount: ColorCount) => void;
};

export function ColorCountField({ colorCount, onChange }: ColorCountFieldProps) {
  const { t } = useTranslation("pillbox");
  const colorCountOptions = [
    { value: 1 as const, label: t("Une couleur") },
    { value: 2 as const, label: t("Deux couleurs") },
  ];
  return (
    <SegmentedControl<ColorCount>
      options={colorCountOptions}
      selectedValue={colorCount}
      onChange={onChange}
      accessibilityLabel={t("Nombre de couleurs")}
    />
  );
}
