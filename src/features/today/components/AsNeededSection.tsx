import { View } from "react-native";
import { useTranslation } from "react-i18next";

import type { Med } from "@/domain/med";

import type { AsNeededMedOfDay } from "@/features/today/utils/todayTypes";
import { AsNeededMedRow } from "./AsNeededMedRow";
import { styles } from "./AsNeededSection.styles";
import { TodaySectionTitle } from "./TodaySectionTitle";

type AsNeededSectionProps = {
  asNeededMeds: AsNeededMedOfDay[];
  onTake: (med: Med) => void;
  onCancel: (asNeededMed: AsNeededMedOfDay) => void;
};

export function AsNeededSection({ asNeededMeds, onTake, onCancel }: AsNeededSectionProps) {
  const { t } = useTranslation("today");
  return (
    <View>
      <TodaySectionTitle title={t("Hors planning")} />
      <View style={styles.card}>
        {asNeededMeds.map((asNeededMed, index) => (
          <AsNeededMedRow
            key={asNeededMed.med.id}
            {...asNeededMed}
            hasTopBorder={index > 0}
            onTake={() => onTake(asNeededMed.med)}
            onCancel={() => onCancel(asNeededMed)}
          />
        ))}
      </View>
    </View>
  );
}
