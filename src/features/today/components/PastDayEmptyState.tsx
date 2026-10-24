import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./TodayEmptyState.styles";

export function PastDayEmptyState() {
  const { t } = useTranslation("today");
  return (
    <View style={styles.card}>
      <Text tone="secondary" style={styles.text}>
        {t("Aucune prise prévue ce jour-là.")}
      </Text>
    </View>
  );
}
