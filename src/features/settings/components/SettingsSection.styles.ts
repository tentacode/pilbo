import { StyleSheet } from "react-native";

import { borderWidth, colors } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  separated: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.separator,
  },
});
