import { Linking, View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./RemindersDisabledNotice.styles";

export function RemindersDisabledNotice() {
  return (
    <View style={styles.notice}>
      <Text variant="bodyBold" accessibilityRole="header">
        Les rappels sont désactivés
      </Text>
      <Text variant="small" tone="secondary">
        Activez les notifications dans les Réglages pour recevoir vos rappels.
      </Text>
      <Button
        label="Ouvrir les Réglages"
        variant="secondary"
        onPress={() => Linking.openSettings()}
      />
    </View>
  );
}
