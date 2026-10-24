import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { sizes } from "@/design-system/tokens";
import { formatMedLabel, type MedQuantity } from "@/domain/med";

import { IntakeMedRow } from "@/features/pillbox/components/IntakeMedRow";
import { pillStackLayoutOf } from "@/features/pillbox/utils/pillStack";
import { formatQuantityAccessibilityLabel } from "@/features/today/utils/formatters";
import { styles } from "./TodayMedList.styles";

type TodayMedListProps = {
  medQuantities: MedQuantity[];
  isLate?: boolean;
  hasFirstBorder?: boolean;
};

export function TodayMedList({
  medQuantities,
  isLate = false,
  hasFirstBorder = true,
}: TodayMedListProps) {
  const { t } = useTranslation("today");
  const pillStackLayout = pillStackLayoutOf(medQuantities);
  return (
    <View>
      {medQuantities.map(({ med, quantity }, index) => (
        <View
          key={med.id}
          accessible
          accessibilityLabel={[
            formatMedLabel(med),
            med.detail,
            formatQuantityAccessibilityLabel(t, quantity),
          ]
            .filter(Boolean)
            .join(", ")}
          style={[
            styles.row,
            isLate && styles.lateRow,
            index === 0 && !hasFirstBorder && styles.borderlessRow,
          ]}
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
