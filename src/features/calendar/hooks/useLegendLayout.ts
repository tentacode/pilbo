import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

import { useFitsInWidth } from "@/design-system/hooks/useFitsInWidth";
import { sizes, spacing } from "@/design-system/tokens";

const COLUMN_COUNT = 2;
const CELL_FIXED_WIDTH = sizes.legendSwatch + spacing.small + spacing.legendColumnGap;
const LEGEND_PADDING = spacing.large * 2;

export function useLegendLayout() {
  const [labelWidth, setLabelWidth] = useState(0);

  const onLabelsMeasureLayout = useCallback((event: LayoutChangeEvent) => {
    setLabelWidth(event.nativeEvent.layout.width);
  }, []);

  const { onLayout, fits } = useFitsInWidth(
    (CELL_FIXED_WIDTH + labelWidth) * COLUMN_COUNT + LEGEND_PADDING,
  );

  return { onLayout, onLabelsMeasureLayout, hasTwoColumns: fits };
}
