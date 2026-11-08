const { withAndroidManifest } = require("expo/config-plugins");

const USE_EXACT_ALARM = "android.permission.USE_EXACT_ALARM";
const SCHEDULE_EXACT_ALARM = "android.permission.SCHEDULE_EXACT_ALARM";

// USE_EXACT_ALARM is granted to reminder apps from Android 13 on, but does not exist on Android 12,
// which needs SCHEDULE_EXACT_ALARM instead (limited to Android 12 so it is never asked later).
const PERMISSIONS = [
  { $: { "android:name": USE_EXACT_ALARM } },
  { $: { "android:name": SCHEDULE_EXACT_ALARM, "android:maxSdkVersion": "32" } },
];

module.exports = function withExactAlarmPermissions(config) {
  return withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults.manifest;
    const names = PERMISSIONS.map((permission) => permission.$["android:name"]);
    manifest["uses-permission"] = [
      ...(manifest["uses-permission"] ?? []).filter(
        (permission) => !names.includes(permission.$["android:name"]),
      ),
      ...PERMISSIONS,
    ];
    return modConfig;
  });
};
