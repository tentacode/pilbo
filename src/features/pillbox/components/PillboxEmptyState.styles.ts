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
    textAlign: "center",
  },
  body: {
    maxWidth: sizes.pageEmptyTextMaxWidth,
  },
  actions: {
    alignItems: "center",
    gap: spacing.medium,
    paddingTop: spacing.small,
  },
});
