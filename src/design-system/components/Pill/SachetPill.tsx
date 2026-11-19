import { G, Path, Rect } from "react-native-svg";

import { useThemeColors } from "../../hooks/useThemeColors";
import { PILL_CENTER, pillStrokes } from "./Pill.styles";

type SachetPillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

const SACHET_ROTATION = 15;
const SACHET_PATH =
  "M11 10L13.25 8L15.5 10L17.75 8L20 10L22.25 8L24.5 10L26.75 8L29 10V30L26.75 32L24.5 30L22.25 32L20 30L17.75 32L15.5 30L13.25 32L11 30Z";

export function SachetPill({ colors, scale, outlineRatio }: SachetPillProps) {
  const themeColors = useThemeColors();
  const strokes = pillStrokes(themeColors, scale, outlineRatio);
  const [centerColor, edgesColor] = colors;
  return (
    <G rotation={SACHET_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Path d={SACHET_PATH} fill={edgesColor} />
      <Rect x={11} y={13} width={18} height={14} fill={centerColor} />
      <Path d={SACHET_PATH} fill="none" {...strokes.outline} />
      <Path d="M11 13h18M11 27h18" {...strokes.scoreLine} />
      <Path d="M14.5 16.5v6" {...strokes.highlight} />
    </G>
  );
}
