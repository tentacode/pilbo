import { borderWidth, pressedOpacity, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  header: {
    alignItems: "center",
    gap: spacing.small,
  },
  hero: {
    width: sizes.medHero,
    height: sizes.medHero,
    borderRadius: radius.round,
    backgroundColor: themeColors.fill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.extraSmall,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  badge: {
    position: "absolute",
    right: spacing.extraSmall,
    bottom: spacing.extraSmall,
    width: sizes.medHeroBadge,
    height: sizes.medHeroBadge,
    borderRadius: radius.round,
    borderWidth: borderWidth.thick,
    borderColor: themeColors.background,
    backgroundColor: themeColors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: {
    textAlign: "center",
  },
}));
