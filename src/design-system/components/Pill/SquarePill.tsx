import { G, Path, Rect } from "react-native-svg";

import { PILL_CENTER, pillStrokes } from "./Pill.styles";

const SQUARE_ROTATION = -15;

type SquarePillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

export function SquarePill({ colors, scale, outlineRatio }: SquarePillProps) {
  const strokes = pillStrokes(scale, outlineRatio);
  const [firstHalfColor, secondHalfColor] = colors;
  return (
    <G rotation={SQUARE_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Rect x={10} y={10} width={20} height={20} rx={5} fill={secondHalfColor} />
      <Path d="M20 10h-5a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h5z" fill={firstHalfColor} />
      <Rect x={10} y={10} width={20} height={20} rx={5} fill="none" {...strokes.outline} />
      <Path d="M13.5 13.5h3.5" {...strokes.highlight} />
    </G>
  );
}
