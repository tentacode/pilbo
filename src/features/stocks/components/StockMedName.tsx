import { useCallback, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { useFitsInWidth } from "@/design-system/hooks/useFitsInWidth";
import type { Med } from "@/domain/med";

import { styles } from "./StockMedName.styles";

type StockMedNameProps = {
  med: Pick<Med, "name" | "strength">;
};

export function StockMedName({ med }: StockMedNameProps) {
  const [requiredWidth, setRequiredWidth] = useState(0);
  const { onLayout, fits } = useFitsInWidth(requiredWidth);
  const hasStrength = med.strength !== "";

  const onMeasureLayout = useCallback((event: LayoutChangeEvent) => {
    setRequiredWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View testID="stock-med-name" onLayout={onLayout}>
      {fits || !hasStrength ? (
        <Text variant="bodyBold">
          {med.name}
          {hasStrength ? <Text> {med.strength}</Text> : null}
        </Text>
      ) : (
        <>
          <Text variant="bodyBold">{med.name}</Text>
          <Text>{med.strength}</Text>
        </>
      )}
      {hasStrength ? (
        // Invisible single line copy without width constraint: its width is the one needed.
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.measureContainer}
        >
          <Text testID="stock-med-name-measure" variant="bodyBold" onLayout={onMeasureLayout}>
            {med.name}
            <Text> {med.strength}</Text>
          </Text>
        </View>
      ) : null}
    </View>
  );
}
