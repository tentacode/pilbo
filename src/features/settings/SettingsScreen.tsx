import { View } from "react-native";

import { IS_DEBUG_MODE } from "@/config/debug";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { ClearDatabaseButton } from "./components/ClearDatabaseButton";
import { CrashTestButton } from "./components/CrashTestButton";
import { NotificationPermissionButton } from "./components/NotificationPermissionButton";
import { ResetDatabaseButton } from "./components/ResetDatabaseButton";
import { RestartOnboardingButton } from "./components/RestartOnboardingButton";
import { styles } from "./SettingsScreen.styles";

export function SettingsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Réglages" />
      <View style={styles.section}>
        <NotificationPermissionButton />
        <RestartOnboardingButton />
      </View>
      {IS_DEBUG_MODE ? (
        <View style={styles.developerSection}>
          <CrashTestButton />
          <ClearDatabaseButton />
          <ResetDatabaseButton />
        </View>
      ) : null}
    </Screen>
  );
}
