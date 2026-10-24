import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";

import { formatLowStockNotice } from "@/features/stocks/utils/formatters";
import { styles } from "./LowStockNotice.styles";

type LowStockNoticeProps = {
  lowStockCount: number;
  onPress: () => void;
  onDismiss: () => void;
};

export function LowStockNotice({ lowStockCount, onPress, onDismiss }: LowStockNoticeProps) {
  const { t } = useTranslation("stocks");
  const message = formatLowStockNotice(t, lowStockCount);
  return (
    <View style={styles.notice}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t("Stock bas")}. ${message}`}
        accessibilityHint={t("Ouvre l’écran Stock.")}
        onPress={onPress}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
      >
        <Icon name="alert" color={colors.onAlert} />
        <View style={styles.texts}>
          <Text variant="bodyBold" tone="onAlert">
            {t("Stock bas")}
          </Text>
          <Text variant="small" tone="onAlert">
            {message}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Masquer l’alerte de stock bas")}
        onPressIn={playPressHaptic}
        onPress={onDismiss}
        style={({ pressed }) => [styles.dismissButton, pressed && styles.pressed]}
      >
        <Icon name="close" color={colors.onAlert} />
      </Pressable>
    </View>
  );
}
