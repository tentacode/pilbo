import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  title: {
    marginTop: spacing.extraSmall,
  },
  content: {
    paddingHorizontal: spacing.large,
  },
});
