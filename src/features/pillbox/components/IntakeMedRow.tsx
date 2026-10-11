import { View } from "react-native";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import type { MedQuantity } from "@/domain/med";

import { styles } from "./IntakeMedRow.styles";

export function IntakeMedRow({ med, quantity }: MedQuantity) {
  return (
    <View style={styles.row}>
      <Pill design={med.design} />
      <Text variant="bodyBold" style={styles.name}>
        {med.name} <Text>{med.strength}</Text>
      </Text>
      <Text variant="bodyBold">{quantity} ×</Text>
    </View>
  );
}
