import { View } from "react-native";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import type { MedQuantity } from "@/domain/med";

import { styles } from "./IntakeMedRow.styles";

type IntakeMedRowProps = MedQuantity & {
  pillSize?: number;
};

export function IntakeMedRow({ med, quantity, pillSize }: IntakeMedRowProps) {
  return (
    <View style={styles.row}>
      <Pill design={med.design} displaySize={pillSize} />
      <Text variant="bodyBold" style={styles.name}>
        {med.name} <Text>{med.strength}</Text>
      </Text>
      <Text variant="bodyBold">{quantity} ×</Text>
    </View>
  );
}
