import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";

import { formatLowStockNotice } from "@/features/stocks/utils/formatters";
import { styles } from "./LowStockNotice.styles";

type LowStockNoticeProps = {
  lowStockCount: number;
  onPress: () => void;
};

export function LowStockNotice({ lowStockCount, onPress }: LowStockNoticeProps) {
  const message = formatLowStockNotice(lowStockCount);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Stock bas. ${message}`}
      accessibilityHint="Ouvre l’écran Stock."
      onPress={onPress}
      style={({ pressed }) => [styles.notice, pressed && styles.pressed]}
    >
      <Icon name="alert" color={colors.alertInk} />
      <View style={styles.texts}>
        <Text variant="bodyBold" tone="alert">
          Stock bas
        </Text>
        <Text variant="small" tone="alert">
          {message}
        </Text>
      </View>
      <Icon name="chevronRight" color={colors.alertInk} />
    </Pressable>
  );
}
