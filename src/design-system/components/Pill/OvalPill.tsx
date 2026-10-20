import { G, Path, Rect } from "react-native-svg";

import { PILL_CENTER, PILL_ROTATION, pillStrokes } from "./Pill.styles";

type OvalPillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

export function OvalPill({ colors, scale, outlineRatio }: OvalPillProps) {
  const strokes = pillStrokes(scale, outlineRatio);
  const [firstHalfColor, secondHalfColor] = colors;
  return (
    <G rotation={PILL_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Rect x={5} y={13} width={30} height={14} rx={7} fill={secondHalfColor} />
      <Path d="M20 13h-8a7 7 0 0 0 0 14h8z" fill={firstHalfColor} />
      <Rect x={5} y={13} width={30} height={14} rx={7} fill="none" {...strokes.outline} />
      <Path d="M20 16v8" {...strokes.scoreLine} />
      <Path d="M10.5 17.3h5" {...strokes.highlight} />
    </G>
  );
}
