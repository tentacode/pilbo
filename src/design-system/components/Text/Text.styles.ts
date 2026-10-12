import { StyleSheet } from "react-native";

import { colors, fontFamily, fontSize } from "../../tokens";

export const variantStyles = StyleSheet.create({
  title: { fontFamily: fontFamily.display, fontSize: fontSize.title },
  heading: { fontFamily: fontFamily.display, fontSize: fontSize.heading },
  time: { fontFamily: fontFamily.display, fontSize: fontSize.time, fontVariant: ["tabular-nums"] },
  body: { fontFamily: fontFamily.regular, fontSize: fontSize.body },
  bodyBold: { fontFamily: fontFamily.bold, fontSize: fontSize.body },
  small: { fontFamily: fontFamily.regular, fontSize: fontSize.small },
  smallBold: { fontFamily: fontFamily.bold, fontSize: fontSize.small },
  buttonSmall: { fontFamily: fontFamily.bold, fontSize: fontSize.buttonSmall },
  help: { fontFamily: fontFamily.regular, fontSize: fontSize.help },
  helpBold: { fontFamily: fontFamily.bold, fontSize: fontSize.help },
  tabLabel: { fontFamily: fontFamily.semiBold, fontSize: fontSize.tabLabel },
  tabLabelSelected: { fontFamily: fontFamily.bold, fontSize: fontSize.tabLabel },
});

export const toneStyles = StyleSheet.create({
  primary: { color: colors.ink },
  secondary: { color: colors.inkSecondary },
  onInk: { color: colors.onInk },
  alert: { color: colors.alertInk },
});
