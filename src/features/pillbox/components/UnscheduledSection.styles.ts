import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  section: {
    marginTop: spacing.huge,
    paddingHorizontal: spacing.large,
  },
  heading: {
    marginHorizontal: spacing.extraSmall,
  },
  help: {
    marginTop: spacing.extraSmall,
    marginBottom: spacing.medium,
    marginHorizontal: spacing.extraSmall,
  },
  group: {
    borderRadius: radius.group,
    backgroundColor: colors.fill,
    overflow: "hidden",
  },
});
