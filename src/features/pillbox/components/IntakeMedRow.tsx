import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import type { MedQuantity } from "@/domain/med";

import type { PillStackLayout } from "@/features/pillbox/utils/pillStack";
import { styles } from "./IntakeMedRow.styles";
import { OverlappingPills } from "./OverlappingPills";

type IntakeMedRowProps = MedQuantity & {
  pillStackLayout: PillStackLayout;
  pillSize?: number;
};

export function IntakeMedRow({ med, quantity, pillStackLayout, pillSize }: IntakeMedRowProps) {
  return (
    <View style={styles.row}>
      <OverlappingPills
        design={med.design}
        quantity={quantity}
        layout={pillStackLayout}
        pillSize={pillSize}
      />
      <Text variant="bodyBold" style={styles.name}>
        {med.name} <Text>{med.strength}</Text>
      </Text>
    </View>
  );
}
