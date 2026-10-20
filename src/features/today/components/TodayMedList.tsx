import { View } from "react-native";

import { sizes } from "@/design-system/tokens";
import { formatMedLabel, type MedQuantity } from "@/domain/med";

import { IntakeMedRow } from "@/features/pillbox/components/IntakeMedRow";
import { pillStackLayoutOf } from "@/features/pillbox/utils/pillStack";
import { styles } from "./TodayMedList.styles";

type TodayMedListProps = {
  medQuantities: MedQuantity[];
  isLate?: boolean;
};

export function TodayMedList({ medQuantities, isLate = false }: TodayMedListProps) {
  const pillStackLayout = pillStackLayoutOf(medQuantities);
  return (
    <View>
      {medQuantities.map(({ med, quantity }) => (
        <View
          key={med.id}
          accessible
          accessibilityLabel={[formatMedLabel(med), med.detail, `quantité ${quantity}`]
            .filter(Boolean)
            .join(", ")}
          style={[styles.row, isLate && styles.lateRow]}
        >
          <IntakeMedRow
            med={med}
            quantity={quantity}
            pillStackLayout={pillStackLayout}
            pillSize={sizes.pillInRow}
            isDetailShown
          />
        </View>
      ))}
    </View>
  );
}
