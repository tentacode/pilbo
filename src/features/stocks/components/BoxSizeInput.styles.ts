import { borderWidth, fontFamily, fontSize, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
  },
  input: {
    minWidth: sizes.boxSizeInputMinimumWidth,
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.small,
    borderRadius: radius.segmentItem,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.surface,
    backgroundColor: themeColors.surface,
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    fontVariant: ["tabular-nums"],
    color: themeColors.ink,
  },
  invalidInput: {
    borderColor: themeColors.alertInk,
  },
}));
