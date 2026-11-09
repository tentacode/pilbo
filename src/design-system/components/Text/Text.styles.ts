import { StyleSheet } from "react-native";

import { fontFamily, fontSize, lineHeight } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const variantStyles = StyleSheet.create({
  title: { fontFamily: fontFamily.display, fontSize: fontSize.title },
  bigNumber: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.bigNumber,
    lineHeight: lineHeight.bigNumber,
    fontVariant: ["tabular-nums"],
  },
  largeHeading: { fontFamily: fontFamily.display, fontSize: fontSize.largeHeading },
  mediumHeading: { fontFamily: fontFamily.display, fontSize: fontSize.mediumHeading },
  heading: { fontFamily: fontFamily.display, fontSize: fontSize.heading },
  time: { fontFamily: fontFamily.display, fontSize: fontSize.time, fontVariant: ["tabular-nums"] },
  compactTime: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.compactTime,
    fontVariant: ["tabular-nums"],
  },
  lead: { fontFamily: fontFamily.regular, fontSize: fontSize.lead, lineHeight: lineHeight.lead },
  leadInline: { fontFamily: fontFamily.regular, fontSize: fontSize.lead },
  body: { fontFamily: fontFamily.regular, fontSize: fontSize.body },
  bodyBold: { fontFamily: fontFamily.bold, fontSize: fontSize.body },
  callout: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.callout,
    lineHeight: lineHeight.callout,
  },
  small: { fontFamily: fontFamily.regular, fontSize: fontSize.small },
  smallBold: { fontFamily: fontFamily.bold, fontSize: fontSize.small },
  buttonSmall: { fontFamily: fontFamily.bold, fontSize: fontSize.buttonSmall },
  help: { fontFamily: fontFamily.regular, fontSize: fontSize.help },
  helpBold: { fontFamily: fontFamily.bold, fontSize: fontSize.help },
  tabLabel: { fontFamily: fontFamily.semiBold, fontSize: fontSize.tabLabel },
  tabLabelSelected: { fontFamily: fontFamily.bold, fontSize: fontSize.tabLabel },
});

export const useToneStyles = createThemedStyles((themeColors) => ({
  primary: { color: themeColors.ink },
  secondary: { color: themeColors.inkSecondary },
  onInk: { color: themeColors.onInk },
  onProminent: { color: themeColors.onProminent },
  alert: { color: themeColors.alertInk },
  onAlert: { color: themeColors.onAlert },
  onCalendarMissed: { color: themeColors.onCalendarMissed },
  success: { color: themeColors.successInk },
  warning: { color: themeColors.warningInk },
}));
