import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./StockPickerEmptyState.styles";

type StockPickerEmptyStateProps = {
  onOpenPillbox: () => void;
};

export function StockPickerEmptyState({ onOpenPillbox }: StockPickerEmptyStateProps) {
  const { t } = useTranslation("stocks");
  return (
    <View style={styles.container}>
      <Text variant="callout" tone="secondary" style={styles.text}>
        {t("Ajoutez d’abord un médicament dans le pilulier.")}
      </Text>
      <Button
        label={t("Ouvrir le pilulier")}
        variant="secondary"
        size="large"
        onPress={onOpenPillbox}
      />
    </View>
  );
}
