import { G, Path, Rect } from "react-native-svg";

import { useThemeColors } from "../../hooks/useThemeColors";
import { pillStrokes } from "./Pill.styles";

type TubePillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

export function TubePill({ colors, scale, outlineRatio }: TubePillProps) {
  const themeColors = useThemeColors();
  const strokes = pillStrokes(themeColors, scale, outlineRatio);
  const [tubeColor, capColor] = colors;
  return (
    <G transform="translate(4 -1) rotate(40 20 19)">
      <Path
        d="M13 11H27L25 26.4C24.8 27.4 24 28 23 28H17C16 28 15.2 27.4 15 26.4Z"
        fill={tubeColor}
        {...strokes.outline}
      />
      <Rect x={12.5} y={7} width={15} height={4} rx={1} fill={tubeColor} {...strokes.outline} />
      <Path d="M16 7.7v2.6M20 7.7v2.6M24 7.7v2.6" {...strokes.scoreLine} />
      <Rect x={16} y={27.5} width={8} height={6} rx={1.5} fill={capColor} {...strokes.outline} />
      <Path d="M16.2 13.5v7" {...strokes.highlight} />
    </G>
  );
}
