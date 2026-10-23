import { useCallback, useState } from "react";
import { type LayoutChangeEvent, useWindowDimensions } from "react-native";

import { useFitsInWidth } from "@/design-system/hooks/useFitsInWidth";
import { sizes, spacing } from "@/design-system/tokens";

const ROW_FIXED_WIDTH = spacing.large + spacing.medium + spacing.large;

export function useSettingsRowLayout() {
  const { fontScale } = useWindowDimensions();
  const [trailingWidth, setTrailingWidth] = useState<number>();

  const onTrailingLayout = useCallback((event: LayoutChangeEvent) => {
    setTrailingWidth(event.nativeEvent.layout.width);
  }, []);

  const requiredWidth =
    trailingWidth === undefined
      ? 0
      : ROW_FIXED_WIDTH + trailingWidth + sizes.settingsLabelMinimumWidth * Math.max(1, fontScale);
  const { onLayout: onRowLayout, fits } = useFitsInWidth(requiredWidth);

  return { onRowLayout, onTrailingLayout, isStacked: !fits };
}
