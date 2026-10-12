import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { ClearDatabaseButton } from "./components/ClearDatabaseButton";
import { CrashTestButton } from "./components/CrashTestButton";
import { ResetDatabaseButton } from "./components/ResetDatabaseButton";
import { styles } from "./SettingsScreen.styles";

export function SettingsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Réglages" />
      {__DEV__ ? (
        <View style={styles.developerSection}>
          <CrashTestButton />
          <ClearDatabaseButton />
          <ResetDatabaseButton />
        </View>
      ) : null}
    </Screen>
  );
}
