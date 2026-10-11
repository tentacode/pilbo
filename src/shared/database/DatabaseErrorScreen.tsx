import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./DatabaseErrorScreen.styles";

type DatabaseErrorScreenProps = {
  error: Error;
};

export function DatabaseErrorScreen({ error }: DatabaseErrorScreenProps) {
  return (
    <Screen>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          Données indisponibles
        </Text>
        <Text>Vos données n’ont pas pu être chargées. Fermez puis relancez l’app.</Text>
        <Text variant="help" tone="secondary">
          {error.message}
        </Text>
      </View>
    </Screen>
  );
}
