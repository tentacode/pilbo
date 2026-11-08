import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { sizes } from "@/design-system/tokens";

import { useStyles } from "./StockStatusLabel.styles";

type StockStatusLabelProps = {
  text: string;
  isLow: boolean;
};

export function StockStatusLabel({ text, isLow }: StockStatusLabelProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  return (
    <View style={[styles.chip, isLow ? styles.lowChip : styles.sufficientChip]}>
      <Icon
        name={isLow ? "alert" : "checkCircle"}
        size={sizes.iconSmall}
        color={isLow ? themeColors.onAlert : themeColors.ink}
      />
      <Text variant="helpBold" tone={isLow ? "onAlert" : "primary"} style={styles.text}>
        {text}
      </Text>
    </View>
  );
}
