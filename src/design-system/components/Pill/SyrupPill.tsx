import { useId } from "react";
import { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import { useThemeColors } from "../../hooks/useThemeColors";
import { PILL_CENTER, pillStrokes, TALL_SHAPE_SCALE } from "./Pill.styles";

type SyrupPillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

const SYRUP_ROTATION = 25;
const BOTTLE_PATH =
  "M16.5 9V11.5C13 12.6 11 14.8 11 18.5V32.5A3 3 0 0 0 14 35.5H26A3 3 0 0 0 29 32.5V18.5C29 14.8 27 12.6 23.5 11.5V9Z";
const LEVEL_LIQUID_PATH = "M0 21.5Q4 20 8 21.5T16 21.5T24 21.5T32 21.5T40 21.5V40H0Z";

export function SyrupPill({ colors, scale, outlineRatio }: SyrupPillProps) {
  const themeColors = useThemeColors();
  const strokes = pillStrokes(themeColors, scale * TALL_SHAPE_SCALE, outlineRatio);
  const bottleClipIdentifier = useId();
  const [liquidColor, bottleColor] = colors;
  return (
    <G scale={TALL_SHAPE_SCALE} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Defs>
        <ClipPath id={bottleClipIdentifier}>
          <Path d={BOTTLE_PATH} transform={`rotate(${SYRUP_ROTATION} 20 20)`} />
        </ClipPath>
      </Defs>
      <G rotation={SYRUP_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
        <Rect
          x={14.5}
          y={3.5}
          width={11}
          height={5.5}
          rx={1.5}
          fill={bottleColor}
          {...strokes.outline}
        />
        <Path d={BOTTLE_PATH} fill={bottleColor} />
      </G>
      <Path d={LEVEL_LIQUID_PATH} fill={liquidColor} clipPath={`url(#${bottleClipIdentifier})`} />
      <G rotation={SYRUP_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
        <Path d={BOTTLE_PATH} fill="none" {...strokes.outline} />
        <Path d="M14.2 15.2q-.9 1.4-.9 3.2" {...strokes.scoreLine} />
      </G>
    </G>
  );
}
