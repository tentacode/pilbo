import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import type { Med } from "@/domain/med";

import { AddMedRow } from "./AddMedRow";
import { UnscheduledMedRow } from "./UnscheduledMedRow";
import { styles } from "./UnscheduledSection.styles";

type UnscheduledSectionProps = {
  meds: Med[];
  onMedPress: (medId: string) => void;
  onAddMed: () => void;
};

export function UnscheduledSection({ meds, onMedPress, onAddMed }: UnscheduledSectionProps) {
  const { t } = useTranslation("pillbox");
  return (
    <View style={styles.section}>
      <Text variant="heading" accessibilityRole="header" style={styles.heading}>
        {t("Hors planning")}
      </Text>
      <Text variant="help" tone="secondary" style={styles.help}>
        {t("À prendre si besoin, depuis l’accueil.")}
      </Text>
      <View style={styles.group}>
        {meds.map((med, index) => (
          <UnscheduledMedRow
            key={med.id}
            med={med}
            hasTopBorder={index > 0}
            onPress={() => onMedPress(med.id)}
          />
        ))}
        <AddMedRow onPress={onAddMed} hasTopBorder={meds.length > 0} />
      </View>
    </View>
  );
}
