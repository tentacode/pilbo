import { StyleSheet } from "react-native";

import { colors, fontFamily, fontSize } from "../../tokens";

export const variantStyles = StyleSheet.create({
  title: { fontFamily: fontFamily.display, fontSize: fontSize.title },
  heading: { fontFamily: fontFamily.display, fontSize: fontSize.heading },
  time: { fontFamily: fontFamily.display, fontSize: fontSize.time, fontVariant: ["tabular-nums"] },
  body: { fontFamily: fontFamily.regular, fontSize: fontSize.body },
  bodyBold: { fontFamily: fontFamily.bold, fontSize: fontSize.body },
  small: { fontFamily: fontFamily.regular, fontSize: fontSize.small },
  help: { fontFamily: fontFamily.regular, fontSize: fontSize.help },
  tabLabel: { fontFamily: fontFamily.semiBold, fontSize: fontSize.tabLabel },
  tabLabelSelected: { fontFamily: fontFamily.bold, fontSize: fontSize.tabLabel },
});

export const toneStyles = StyleSheet.create({
  primary: { color: colors.ink },
  secondary: { color: colors.inkSecondary },
});
