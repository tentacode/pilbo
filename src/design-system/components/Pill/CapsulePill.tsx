import { G, Path, Rect } from "react-native-svg";

import { PILL_CENTER, PILL_ROTATION, pillStrokes } from "./Pill.styles";

type CapsulePillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

export function CapsulePill({ colors, scale, outlineRatio }: CapsulePillProps) {
  const strokes = pillStrokes(scale, outlineRatio);
  const [firstHalfColor, secondHalfColor] = colors;
  return (
    <G rotation={PILL_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Path d="M20 13.5h-7.5a6.5 6.5 0 0 0 0 13H20z" fill={firstHalfColor} />
      <Path d="M20 13.5h7.5a6.5 6.5 0 0 1 0 13H20z" fill={secondHalfColor} />
      <Rect x={6} y={13.5} width={28} height={13} rx={6.5} fill="none" {...strokes.outline} />
      <Path d="M20 13.5v13" {...strokes.junction} />
      <Path d="M10.5 17.2h5" {...strokes.highlight} />
    </G>
  );
}
