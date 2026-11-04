import { StyleSheet } from "react-native";

import { sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.medium,
    paddingTop: spacing.pageEmptyTop,
    paddingHorizontal: spacing.large,
  },
  text: {
    maxWidth: sizes.pageEmptyTextMaxWidth,
    textAlign: "center",
  },
});
