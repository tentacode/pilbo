import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";

import { StocksEmptyIllustration } from "./StocksEmptyIllustration";
import { styles } from "./StocksEmptyState.styles";

export function StocksEmptyState() {
  const { t } = useTranslation("stocks");
  return (
    <View style={styles.container}>
      <StocksEmptyIllustration />
      <Text variant="mediumHeading" accessibilityRole="header" style={styles.text}>
        {t("Aucun médicament suivi")}
      </Text>
      <Text variant="callout" tone="secondary" style={[styles.text, styles.body]}>
        {t("Suivez le stock d’un médicament : Pilbo vous préviendra avant que vous en manquiez.")}
      </Text>
    </View>
  );
}
