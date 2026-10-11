import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import type { Med } from "@/domain/med";

import { AddMedRow } from "./AddMedRow";
import { UnscheduledMedRow } from "./UnscheduledMedRow";
import { styles } from "./UnscheduledSection.styles";

type UnscheduledSectionProps = {
  meds: Med[];
};

export function UnscheduledSection({ meds }: UnscheduledSectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="heading" accessibilityRole="header" style={styles.heading}>
        Hors planning
      </Text>
      <Text variant="help" tone="secondary" style={styles.help}>
        À prendre si besoin, depuis l’accueil.
      </Text>
      <View style={styles.group}>
        {meds.map((med) => (
          <UnscheduledMedRow key={med.id} med={med} />
        ))}
        <AddMedRow />
      </View>
    </View>
  );
}
