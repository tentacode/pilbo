import { StyleSheet } from "react-native";

import { disabledOpacity, radius, sizes } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const styles = StyleSheet.create({
  button: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: disabledOpacity,
  },
});

export const useVariantStyles = createThemedStyles((themeColors) => ({
  filled: { backgroundColor: themeColors.ink },
  soft: { backgroundColor: themeColors.fill },
  plain: {},
}));
