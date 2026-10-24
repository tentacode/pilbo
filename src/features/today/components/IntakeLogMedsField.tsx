import { View } from "react-native";
import { useTranslation } from "react-i18next";

import type { MedQuantity } from "@/domain/med";

import { FormGroup } from "@/features/pillbox/components/FormGroup";
import { FormSection } from "@/features/pillbox/components/FormSection";
import { styles } from "./IntakeLogMedsField.styles";
import { TodayMedList } from "./TodayMedList";

type IntakeLogMedsFieldProps = {
  medQuantities: MedQuantity[];
};

export function IntakeLogMedsField({ medQuantities }: IntakeLogMedsFieldProps) {
  const { t } = useTranslation("today");
  return (
    <FormSection label={t("Médicaments")}>
      <FormGroup>
        <View style={styles.list}>
          <TodayMedList medQuantities={medQuantities} hasFirstBorder={false} />
        </View>
      </FormGroup>
    </FormSection>
  );
}
