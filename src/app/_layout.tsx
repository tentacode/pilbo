import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { useDesignSystemFonts } from "@/design-system/fonts";
import { DatabaseErrorScreen } from "@/shared/database/DatabaseErrorScreen";
import { useDatabaseReady } from "@/shared/database/hooks/useDatabaseReady";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsReady = useDesignSystemFonts();
  const { isReady: databaseReady, error: databaseError } = useDatabaseReady();
  const canHideSplash = fontsReady && (databaseReady || databaseError !== undefined);

  useEffect(() => {
    if (canHideSplash) {
      SplashScreen.hideAsync();
    }
  }, [canHideSplash]);

  if (!canHideSplash) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      {databaseError ? (
        <DatabaseErrorScreen error={databaseError} />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </>
  );
}
