import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Pilbo",
  slug: "pilbo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "pilbo",
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/images/icon.png",
    bundleIdentifier: "com.tentacode.pilbo",
    appleTeamId: process.env.APPLE_TEAM_ID,
  },
  plugins: [
    "expo-router",
    ["expo-build-properties", { ios: { ccacheEnabled: true } }],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
        dark: {
          backgroundColor: "#15122B",
          image: "./assets/images/splash-icon.png",
        },
      },
    ],
    "./plugins/withoutPushEntitlement",
    [
      "expo-notifications",
      {
        sounds: ["./assets/sounds/beep.wav"],
      },
    ],
    "expo-sqlite",
    "./plugins/withSqliteHeader",
    "expo-localization",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
