import { View } from "react-native";

import { sizes } from "@/design-system/tokens";
import type { MedQuantity } from "@/domain/med";

import { IntakeMedRow } from "@/features/pillbox/components/IntakeMedRow";
import { styles } from "./TodayMedList.styles";

type TodayMedListProps = {
  medQuantities: MedQuantity[];
  isLate?: boolean;
};

export function TodayMedList({ medQuantities, isLate = false }: TodayMedListProps) {
  return (
    <View>
      {medQuantities.map(({ med, quantity }) => (
        <View
          key={med.id}
          accessible
          accessibilityLabel={`${med.name} ${med.strength}, quantité ${quantity}`}
          style={[styles.row, isLate && styles.lateRow]}
        >
          <IntakeMedRow med={med} quantity={quantity} pillSize={sizes.pillInRow} />
        </View>
      ))}
    </View>
  );
}
