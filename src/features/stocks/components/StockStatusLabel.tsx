import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";

import { styles } from "./StockStatusLabel.styles";

type StockStatusLabelProps = {
  text: string;
  isLow: boolean;
};

export function StockStatusLabel({ text, isLow }: StockStatusLabelProps) {
  return (
    <View style={[styles.chip, isLow ? styles.lowChip : styles.sufficientChip]}>
      <Icon
        name={isLow ? "alert" : "checkCircle"}
        size={sizes.iconSmall}
        color={isLow ? colors.alertInk : colors.ink}
      />
      <Text variant="helpBold" tone={isLow ? "alert" : "primary"} style={styles.text}>
        {text}
      </Text>
    </View>
  );
}
