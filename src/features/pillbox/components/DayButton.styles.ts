import { borderWidth, radius } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.lineStrong,
  },
  selected: {
    borderColor: themeColors.ink,
    backgroundColor: themeColors.ink,
  },
  label: {
    textAlign: "center",
  },
}));
