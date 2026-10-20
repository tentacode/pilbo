import { View } from "react-native";

import type { MedQuantity } from "@/domain/med";

import type { PillStackLayout } from "@/features/pillbox/utils/pillStack";
import { styles } from "./IntakeMedRow.styles";
import { MedName } from "./MedName";
import { OverlappingPills } from "./OverlappingPills";

type IntakeMedRowProps = MedQuantity & {
  pillStackLayout: PillStackLayout;
  pillSize?: number;
  isDetailShown?: boolean;
};

export function IntakeMedRow({
  med,
  quantity,
  pillStackLayout,
  pillSize,
  isDetailShown = false,
}: IntakeMedRowProps) {
  return (
    <View style={styles.row}>
      <OverlappingPills
        design={med.design}
        quantity={quantity}
        layout={pillStackLayout}
        pillSize={pillSize}
      />
      <View style={styles.name}>
        <MedName med={isDetailShown ? med : { ...med, detail: "" }} />
      </View>
    </View>
  );
}
