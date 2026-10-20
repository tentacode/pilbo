import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  panel: {
    gap: spacing.small,
    marginTop: spacing.large,
    padding: spacing.colorPanelPadding,
    borderRadius: radius.colorPanel,
    backgroundColor: colors.fill,
  },
  label: {
    marginHorizontal: spacing.tiny,
  },
  secondLabel: {
    marginTop: spacing.small,
  },
});
