import { View } from "react-native";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { pillStackOverlapRatio, sizes } from "@/design-system/tokens";
import type { PillDesign } from "@/domain/med";

import {
  type PillStackLayout,
  pillStackWidth,
  visiblePillCount,
} from "@/features/pillbox/utils/pillStack";
import { styles } from "./OverlappingPills.styles";

type OverlappingPillsProps = {
  design: PillDesign;
  quantity: number;
  layout: PillStackLayout;
  pillSize?: number;
};

export function OverlappingPills({
  design,
  quantity,
  layout,
  pillSize = sizes.pillInList,
}: OverlappingPillsProps) {
  const visibleCount = visiblePillCount(quantity);
  const hiddenCount = quantity - visibleCount;
  const overlapStyle = { marginLeft: -pillSize * pillStackOverlapRatio };
  const pillsWidth = pillStackWidth(layout.pillSlotCount, pillSize, pillStackOverlapRatio);

  return (
    <View style={styles.stack}>
      <View style={[styles.pills, { width: pillsWidth }]}>
        {Array.from({ length: visibleCount }, (_, index) => (
          <View key={index} testID="overlapping-pill" style={index > 0 && overlapStyle}>
            <Pill design={design} displaySize={pillSize} />
          </View>
        ))}
      </View>
      {layout.hasHiddenCountSlot ? (
        <View style={styles.hiddenCountSlot}>
          {hiddenCount > 0 ? (
            <Text variant="smallBold" tone="secondary">
              +{hiddenCount}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
