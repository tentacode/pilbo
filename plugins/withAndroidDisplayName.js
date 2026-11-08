const { AndroidConfig, withStringsXml } = require("expo/config-plugins");

// The Android launcher label comes from the app_name string, which Expo fills with config.name.
// config.name also names the native projects, so it stays "Pilbo" and only the label changes.
module.exports = function withAndroidDisplayName(config, displayName) {
  return withStringsXml(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Strings.setStringItem(
      [AndroidConfig.Resources.buildResourceItem({ name: "app_name", value: displayName })],
      modConfig.modResults,
    );
    return modConfig;
  });
};
