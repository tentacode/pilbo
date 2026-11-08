import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    borderRadius: radius.card,
    backgroundColor: themeColors.fill,
    paddingTop: spacing.medium,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  pressed: {
    backgroundColor: themeColors.separator,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  schedule: {
    marginTop: spacing.extraSmall,
  },
  meds: {
    gap: spacing.small,
    marginTop: spacing.medium,
  },
}));
