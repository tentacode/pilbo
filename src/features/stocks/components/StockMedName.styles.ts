import { StyleSheet } from "react-native";

import { sizes } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  measureContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: sizes.unconstrainedMeasureWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0,
  },
});
