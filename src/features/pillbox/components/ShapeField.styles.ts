import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const SHAPE_COLUMN_COUNT = 3;

export const shapeCellLayout = {
  flexBasis: "30%",
  flexGrow: 1,
} as const;

export const styles = StyleSheet.create({
  shapes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.small,
  },
  emptyCell: shapeCellLayout,
});
