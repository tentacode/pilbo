import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.sheetTop,
    paddingHorizontal: spacing.large,
  },
  grabber: {
    alignSelf: "center",
    width: sizes.grabberWidth,
    height: sizes.grabberHeight,
    marginBottom: spacing.extraSmall,
    borderRadius: radius.round,
    backgroundColor: colors.grabber,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    minHeight: sizes.navigationBarMinimumHeight,
  },
  side: {
    flexShrink: 0,
    alignItems: "flex-start",
  },
  endSide: {
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: spacing.large,
    paddingTop: spacing.medium,
    paddingBottom: spacing.extraLarge,
  },
  footer: {
    paddingTop: spacing.sheetFooterTop,
    paddingHorizontal: spacing.large,
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
});
