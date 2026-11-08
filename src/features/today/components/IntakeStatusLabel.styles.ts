import { StyleSheet } from "react-native";

import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.buttonIconGap,
    paddingVertical: spacing.chipVertical,
    paddingLeft: spacing.chipStart,
    paddingRight: spacing.chipEnd,
    borderRadius: radius.round,
  },
  text: {
    flexShrink: 1,
  },
});

export const useAppearanceStyles = createThemedStyles((themeColors) => ({
  upcoming: { backgroundColor: themeColors.accentSoft },
  late: { backgroundColor: themeColors.alertChip },
  taken: { backgroundColor: themeColors.successChip },
  skipped: { backgroundColor: themeColors.skipChip },
}));
