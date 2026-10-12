import { View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Screen } from "@/design-system/components/Screen/Screen";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./ErrorScreen.styles";
import { contactSupport } from "./utils/contactSupport";

type ErrorScreenProps = {
  title?: string;
  message?: string;
  details?: string;
};

export function ErrorScreen({
  title = "Oups, petit contretemps",
  message = "Quelque chose ne s’est pas passé comme prévu. Fermez puis relancez l’app, et vérifiez si c’est corrigé.",
  details,
}: ErrorScreenProps) {
  return (
    <Screen>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        <Text>{message}</Text>
        {details ? (
          <Text variant="help" tone="secondary">
            {details}
          </Text>
        ) : null}
        <Text>Si le problème persiste, écrivez-nous.</Text>
        <View style={styles.action}>
          <Button
            label="Contactez-nous"
            accessibilityHint="Ouvre un e-mail à l’équipe Pilbo"
            onPress={() => contactSupport(details)}
          />
        </View>
      </View>
    </Screen>
  );
}
