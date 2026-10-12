import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { CrashTestButton } from "./components/CrashTestButton";
import { styles } from "./SettingsScreen.styles";

export function SettingsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Réglages" />
      {__DEV__ ? (
        <View style={styles.developerSection}>
          <CrashTestButton />
        </View>
      ) : null}
    </Screen>
  );
}
