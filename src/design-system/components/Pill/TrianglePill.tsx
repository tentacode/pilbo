import { G, Path } from "react-native-svg";

import { PILL_CENTER, pillStrokes } from "./Pill.styles";

type TrianglePillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

// The shared pill rotation makes the triangle look like a "play" icon.
const TRIANGLE_ROTATION = -15;
const TRIANGLE_PATH =
  "M15.67 11.33a5 5 0 0 1 8.66 0l5.34 9.25a5 5 0 0 1-4.33 7.5h-10.68a5 5 0 0 1-4.33-7.5z";
const LEFT_HALF_PATH = "M20 8.83a5 5 0 0 0-4.33 2.5l-5.34 9.25a5 5 0 0 0 4.33 7.5H20z";

export function TrianglePill({ colors, scale, outlineRatio }: TrianglePillProps) {
  const strokes = pillStrokes(scale, outlineRatio);
  const [firstHalfColor, secondHalfColor] = colors;
  return (
    <G rotation={TRIANGLE_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Path d={TRIANGLE_PATH} fill={secondHalfColor} />
      <Path d={LEFT_HALF_PATH} fill={firstHalfColor} />
      <Path d={TRIANGLE_PATH} fill="none" {...strokes.outline} />
      <Path d="M17.45 15.25l-2 3.46" {...strokes.highlight} />
    </G>
  );
}
