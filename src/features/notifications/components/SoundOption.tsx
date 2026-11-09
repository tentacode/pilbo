import { Pressable } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";

import { useStyles } from "./SoundOption.styles";

type SoundOptionProps = {
  name: string;
  isSelected: boolean;
  hasTopBorder: boolean;
  accessibilityHint: string;
  onPress: () => void;
};

export function SoundOption({
  name,
  isSelected,
  hasTopBorder,
  accessibilityHint,
  onPress,
}: SoundOptionProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={name}
      accessibilityState={{ checked: isSelected }}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        hasTopBorder && styles.topBorder,
        pressed && styles.pressed,
      ]}
    >
      <Text variant={isSelected ? "bodyBold" : "body"} style={styles.name}>
        {name}
      </Text>
      {isSelected ? <Icon name="check" color={themeColors.ink} /> : null}
    </Pressable>
  );
}
