import type { ColorValue } from "react-native";
import Svg, { G } from "react-native-svg";

import { colors, sizes } from "../../tokens";
import { iconShapes, type IconName } from "./iconShapes";

const STROKE_WIDTH = 1.8;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = sizes.icon, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <G
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconShapes[name]}
      </G>
    </Svg>
  );
}
