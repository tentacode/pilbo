import { Circle, Path } from "react-native-svg";

import { pillStrokes } from "./Pill.styles";

type RoundPillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

export function RoundPill({ colors, scale, outlineRatio }: RoundPillProps) {
  const strokes = pillStrokes(scale, outlineRatio);
  const [topColor, bottomColor] = colors;
  return (
    <>
      <Circle cx={20} cy={20} r={13} fill={bottomColor} />
      <Path d="M7 20a13 13 0 0 1 26 0z" fill={topColor} />
      <Circle cx={20} cy={20} r={13} fill="none" {...strokes.outline} />
      <Path d="M11 20h18" {...strokes.scoreLine} />
      <Path d="M12.8 14.6a9 9 0 0 1 4.6-3.9" {...strokes.highlight} />
    </>
  );
}
