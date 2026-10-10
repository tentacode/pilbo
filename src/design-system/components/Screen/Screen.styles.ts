import { StyleSheet } from "react-native";

import { colors, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.extraLarge,
  },
});
