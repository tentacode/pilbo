import { Pressable, View } from "react-native";

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

const CUSTOM_COLOR_LABEL = "Autre couleur";

export function CustomColorButton({
  color,
  isSelected,
  isExpanded,
  onPress,
}: CustomColorButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={CUSTOM_COLOR_LABEL}
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
        {CUSTOM_COLOR_LABEL}
      </Text>
      {isExpanded ? null : <Icon name="plus" size={sizes.iconSmall} color={colors.inkSecondary} />}
    </Pressable>
  );
}
