import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ColorWheel } from "@/design-system/components/ColorWheel/ColorWheel";
import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors, customColorWheel, sizes } from "@/design-system/tokens";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";

import { styles } from "./CustomColorButton.styles";

type CustomColorButtonProps = {
  color: string;
  isSelected: boolean;
  isExpanded: boolean;
  onPress: () => void;
};

export function CustomColorButton({
  color,
  isSelected,
  isExpanded,
  onPress,
}: CustomColorButtonProps) {
  const { t } = useTranslation("pillbox");
  const label = t("Autre couleur");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected, expanded: isExpanded }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.wheel}>
        <ColorWheel colors={customColorWheel} />
        {isSelected ? <View style={[styles.center, { backgroundColor: color }]} /> : null}
      </View>
      <Text variant="buttonSmall" style={styles.label}>
        {label}
      </Text>
      {isExpanded ? null : <Icon name="plus" size={sizes.iconSmall} color={colors.inkSecondary} />}
    </Pressable>
  );
}
