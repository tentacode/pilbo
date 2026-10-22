import { useCallback, useState } from "react";
import { type LayoutChangeEvent, useWindowDimensions } from "react-native";

import { useFitsInWidth } from "@/design-system/hooks/useFitsInWidth";
import { sizes, spacing } from "@/design-system/tokens";

const MED_ROW_FIXED_WIDTH =
  spacing.large +
  sizes.pillInRow +
  spacing.medium +
  spacing.medium +
  sizes.iconSmall +
  spacing.small +
  spacing.large;

export function useMedRowLayout() {
  const { fontScale } = useWindowDimensions();
  const [stepperWidth, setStepperWidth] = useState<number>();

  const onStepperLayout = useCallback((event: LayoutChangeEvent) => {
    setStepperWidth(event.nativeEvent.layout.width);
  }, []);

  const requiredWidth =
    stepperWidth === undefined
      ? 0
      : MED_ROW_FIXED_WIDTH + stepperWidth + sizes.medTextMinimumWidth * Math.max(1, fontScale);
  const { onLayout: onRowLayout, fits } = useFitsInWidth(requiredWidth);

  return { onRowLayout, onStepperLayout, isStacked: !fits };
}
