import type { ExpoConfig } from "expo/config";

const BASE_BUNDLE_IDENTIFIER = "com.tentacode.pilbo";

type AppVariant = "dev" | "prod";

const VARIANTS: Record<
  AppVariant,
  { displayName: string; bundleIdentifier: string; icon: string }
> = {
  dev: {
    displayName: "Pilbo Dev",
    bundleIdentifier: `${BASE_BUNDLE_IDENTIFIER}.dev`,
    icon: "./assets/images/icon-dev.png",
  },
  prod: {
    displayName: "Pilbo",
    bundleIdentifier: BASE_BUNDLE_IDENTIFIER,
    icon: "./assets/images/icon.png",
  },
};

function readAppVariant(): AppVariant {
  const appVariant = process.env.APP_VARIANT ?? "prod";
  if (appVariant !== "dev" && appVariant !== "prod") {
    throw new Error(`Unknown APP_VARIANT "${appVariant}", expected "dev" or "prod".`);
  }
  return appVariant;
}

const appVariant = readAppVariant();
const variant = VARIANTS[appVariant];

const config: ExpoConfig = {
  name: "Pilbo",
  slug: "pilbo",
  version: "1.0.0",
  orientation: "portrait",
  icon: variant.icon,
  scheme: "pilbo",
  userInterfaceStyle: "automatic",
  ios: {
    icon: variant.icon,
    bundleIdentifier: variant.bundleIdentifier,
    buildNumber: process.env.BUILD_NUMBER,
    appleTeamId: process.env.APPLE_TEAM_ID,
    entitlements: {
      "com.apple.developer.usernotifications.time-sensitive": true,
    },
    infoPlist: {
      CFBundleDisplayName: variant.displayName,
      ITSAppUsesNonExemptEncryption: false,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
          NSPrivacyAccessedAPITypeReasons: ["C617.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategorySystemBootTime",
          NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
        },
      ],
    },
  },
  extra: {
    appVariant,
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
