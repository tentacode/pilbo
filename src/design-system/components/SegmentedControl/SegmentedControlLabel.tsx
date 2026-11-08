import { View } from "react-native";

import { useThemeColors } from "../../hooks/useThemeColors";
import { sizes } from "../../tokens";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text } from "../Text/Text";
import { styles } from "./SegmentedControlLabel.styles";

type SegmentedControlLabelProps = {
  label: string;
  icon?: IconName;
  isSelected: boolean;
};

export function SegmentedControlLabel({ label, icon, isSelected }: SegmentedControlLabelProps) {
  const themeColors = useThemeColors();
  return (
    <View style={styles.content}>
      {icon ? (
        <Icon
          name={icon}
          size={sizes.iconSmall}
          color={isSelected ? themeColors.ink : themeColors.inkSecondary}
        />
      ) : null}
      <Text
        variant={isSelected ? "buttonSmall" : "callout"}
        tone={isSelected ? "primary" : "secondary"}
        style={styles.label}
      >
        {label}
      </Text>
    </View>
  );
}
