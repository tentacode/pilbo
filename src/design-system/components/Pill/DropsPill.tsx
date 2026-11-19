import { G, Path, Rect } from "react-native-svg";

import { useThemeColors } from "../../hooks/useThemeColors";
import { PILL_CENTER, pillStrokes, TALL_SHAPE_SCALE } from "./Pill.styles";

type DropsPillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

const GLASS_PATH = "M17 14.5H23V24.5L21 28.5H19L17 24.5Z";

export function DropsPill({ colors, scale, outlineRatio }: DropsPillProps) {
  const themeColors = useThemeColors();
  const strokes = pillStrokes(themeColors, scale * TALL_SHAPE_SCALE, outlineRatio);
  const [liquidColor, pipetteColor] = colors;
  return (
    <G scale={TALL_SHAPE_SCALE} originX={PILL_CENTER} originY={PILL_CENTER}>
      <G transform="translate(3 0) rotate(30 20 15)">
        <Rect
          x={15}
          y={2}
          width={10}
          height={9.5}
          rx={5}
          fill={pipetteColor}
          {...strokes.outline}
        />
        <Path d={GLASS_PATH} fill={pipetteColor} />
        <Path d="M17.7 20.5H22.3V24.3L20.6 27.7H19.4L17.7 24.3Z" fill={liquidColor} />
        <Path d={GLASS_PATH} fill="none" {...strokes.outline} />
        <Rect
          x={13.5}
          y={11}
          width={13}
          height={3.5}
          rx={1.5}
          fill={pipetteColor}
          {...strokes.outline}
        />
        <Path d="M17.6 4.5q-.6 1.5-.4 3" {...strokes.highlight} />
      </G>
      <Path
        d="M16.25 29.3C16.25 29.3 13.3 32.6 13.3 34.4A2.95 2.95 0 0 0 19.2 34.4C19.2 32.6 16.25 29.3 16.25 29.3Z"
        fill={liquidColor}
        {...strokes.outline}
      />
    </G>
  );
}
