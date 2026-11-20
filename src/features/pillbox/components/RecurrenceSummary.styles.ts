import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.medium,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: radius.group,
    backgroundColor: themeColors.accentSoft,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
}));
