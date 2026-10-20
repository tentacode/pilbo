import { StyleSheet } from "react-native";

import { colors, radius } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  group: {
    borderRadius: radius.group,
    backgroundColor: colors.fill,
    overflow: "hidden",
  },
});
