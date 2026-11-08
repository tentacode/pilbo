import type { ColorValue } from "react-native";
import Svg, { G } from "react-native-svg";

import { useThemeColors } from "../../hooks/useThemeColors";
import { sizes } from "../../tokens";
import { iconShapes, type IconName } from "./iconShapes";

const STROKE_WIDTH = 1.8;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = sizes.icon, color }: IconProps) {
  const themeColors = useThemeColors();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <G
        fill="none"
        stroke={color ?? themeColors.ink}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconShapes[name]}
      </G>
    </Svg>
  );
}
