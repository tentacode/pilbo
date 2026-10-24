import { View } from "react-native";
import { useTranslation } from "react-i18next";

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

export function ErrorScreen({ title, message, details }: ErrorScreenProps) {
  const { t } = useTranslation("common");
  return (
    <Screen>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {title ?? t("Oups, petit contretemps")}
        </Text>
        <Text>
          {message ??
            t(
              "Quelque chose ne s’est pas passé comme prévu. Fermez puis relancez l’app, et vérifiez si c’est corrigé.",
            )}
        </Text>
        {details ? (
          <Text variant="help" tone="secondary">
            {details}
          </Text>
        ) : null}
        <Text>{t("Si le problème persiste, écrivez-nous.")}</Text>
        <View style={styles.action}>
          <Button
            label={t("Contactez-nous")}
            accessibilityHint={t("Ouvre un e-mail à l’équipe Pilbo")}
            onPress={() => contactSupport(t, details)}
          />
        </View>
      </View>
    </Screen>
  );
}
