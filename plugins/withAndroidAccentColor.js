const {
  AndroidConfig,
  withAndroidColors,
  withAndroidColorsNight,
  withAndroidStyles,
} = require("expo/config-plugins");

const COLOR_NAME = "colorAccent";

// Native Android dialogs (Alert), text cursors and selection handles use the theme accent color,
// which defaults to the AppCompat teal and fails the AA contrast on white.
module.exports = function withAndroidAccentColor(config, { light, dark }) {
  const withLightColor = withAndroidColors(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(modConfig.modResults, {
      name: COLOR_NAME,
      value: light,
    });
    return modConfig;
  });
  const withNightColor = withAndroidColorsNight(withLightColor, (modConfig) => {
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(modConfig.modResults, {
      name: COLOR_NAME,
      value: dark,
    });
    return modConfig;
  });
  return withAndroidStyles(withNightColor, (modConfig) => {
    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeGroup(),
      name: COLOR_NAME,
      value: `@color/${COLOR_NAME}`,
    });
    return modConfig;
  });
};
