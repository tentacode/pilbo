import { StyleSheet } from "react-native";

import { radius, sizes, spacing, colors } from "../../tokens";

export const styles = StyleSheet.create({
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
  spacer: {
    flex: 1,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  stackedTitle: {
    textAlign: "center",
    paddingBottom: spacing.small,
  },
  measureContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: sizes.unconstrainedMeasureWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0,
  },
});
