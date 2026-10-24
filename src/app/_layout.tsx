import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { IS_DEBUG_MODE } from "@/config/debug";
import { useDesignSystemFonts } from "@/design-system/fonts";
import { useReminderScheduling } from "@/features/notifications/hooks/useReminderScheduling";
import { isFirstLaunch, useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { setupFirstLaunch } from "@/features/onboarding/utils/setupFirstLaunch";
import { useI18nLanguageSync } from "@/features/settings/hooks/useI18nLanguageSync";
import { getAppLanguage } from "@/features/settings/utils/appLanguage";
import { DatabaseErrorScreen } from "@/shared/database/DatabaseErrorScreen";
import { useDatabaseReady } from "@/shared/database/hooks/useDatabaseReady";
import type { Database } from "@/shared/database/types";
import { setI18nLanguage } from "@/shared/i18n/i18n";

export { ErrorBoundary } from "@/shared/error-handling/ErrorBoundary";

SplashScreen.preventAutoHideAsync();
setI18nLanguage(getAppLanguage());

function onDatabaseMigrated(database: Database): void {
  setupFirstLaunch(database, { isDebugMode: IS_DEBUG_MODE, isFirstLaunch: isFirstLaunch() });
}

export default function RootLayout() {
  const fontsReady = useDesignSystemFonts();
  const onboardingDone = useOnboardingStore((state) => state.onboardingDone);
  const { isReady: databaseReady, error: databaseError } = useDatabaseReady(onDatabaseMigrated);
  const canHideSplash = fontsReady && (databaseReady || databaseError !== undefined);
  useReminderScheduling(databaseReady);
  useI18nLanguageSync();

  useEffect(() => {
    if (canHideSplash) {
      SplashScreen.hideAsync();
    }
  }, [canHideSplash]);

  if (!canHideSplash) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      {databaseError ? (
        <DatabaseErrorScreen error={databaseError} />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Protected guard={!onboardingDone}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>
          <Stack.Protected guard={onboardingDone}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="not-medical" />
            <Stack.Screen name="intake" options={{ presentation: "modal" }} />
            <Stack.Screen name="as-needed" options={{ presentation: "modal" }} />
            <Stack.Screen name="stock" options={{ presentation: "modal" }} />
            <Stack.Screen name="day/[date]" options={{ presentation: "modal" }} />
            <Stack.Screen name="intake-log" options={{ presentation: "modal" }} />
          </Stack.Protected>
        </Stack>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
