import type { ExpoConfig } from "expo/config";
import { artworkConfig } from "./assets/artwork/config.ts";
import { darkColors, lightColors } from "./src/design-system/tokens.ts";

const BASE_BUNDLE_IDENTIFIER = "com.tentacode.pilbo";

type AppVariant = "dev" | "prod";

// Added by Expo and its modules, unused by Pilbo
const UNUSED_ANDROID_PERMISSIONS = [
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
];

const VARIANTS: Record<
  AppVariant,
  {
    displayName: string;
    bundleIdentifier: string;
    icon: string;
    adaptiveIconForeground: string;
    blockedAndroidPermissions: string[];
  }
> = {
  dev: {
    displayName: "Pilbo Dev",
    bundleIdentifier: `${BASE_BUNDLE_IDENTIFIER}.dev`,
    icon: "./assets/images/icon-dev.png",
    adaptiveIconForeground: "./assets/images/adaptive-icon-foreground-dev.png",
    // Pilbo Dev loads its JavaScript from Metro over the network
    blockedAndroidPermissions: UNUSED_ANDROID_PERMISSIONS,
  },
  prod: {
    displayName: "Pilbo",
    bundleIdentifier: BASE_BUNDLE_IDENTIFIER,
    icon: "./assets/images/icon.png",
    adaptiveIconForeground: "./assets/images/adaptive-icon-foreground.png",
    blockedAndroidPermissions: [...UNUSED_ANDROID_PERMISSIONS, "android.permission.INTERNET"],
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
  android: {
    package: variant.bundleIdentifier,
    blockedPermissions: variant.blockedAndroidPermissions,
    adaptiveIcon: {
      foregroundImage: variant.adaptiveIconForeground,
      backgroundImage: "./assets/images/adaptive-icon-background.png",
    },
  },
  extra: {
    appVariant,
  },
  plugins: [
    "expo-router",
    ["expo-build-properties", { ios: { ccacheEnabled: true }, android: { minSdkVersion: 30 } }],
    [
      "expo-splash-screen",
      {
        backgroundColor: artworkConfig.background,
        image: "./assets/images/splash.png",
        enableFullScreenImage_legacy: true,
        resizeMode: "cover",
        dark: {
          backgroundColor: artworkConfig.darkBackground,
          image: "./assets/images/splash-dark.png",
        },
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          dark: { image: "./assets/images/splash-icon.png" },
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
    ["./plugins/withAndroidDisplayName", variant.displayName],
    "./plugins/withExactAlarmPermissions",
    "./plugins/withReleaseSigning",
    "./plugins/withAbiSplits",
    ["./plugins/withAndroidAccentColor", { light: lightColors.ink, dark: darkColors.ink }],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
