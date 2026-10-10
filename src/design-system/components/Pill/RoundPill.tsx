import { Circle, Path } from "react-native-svg";

import { pillStrokes } from "./Pill.styles";

type RoundPillProps = {
  color: string;
  hasScoreLine: boolean;
  scale: number;
};

export function RoundPill({ color, hasScoreLine, scale }: RoundPillProps) {
  const strokes = pillStrokes(scale);
  return (
    <>
      <Circle cx={20} cy={20} r={13} fill={color} {...strokes.outline} />
      {hasScoreLine && <Path d="M11 20h18" {...strokes.scoreLine} />}
      <Path d="M12.8 14.6a9 9 0 0 1 4.6-3.9" {...strokes.highlight} />
    </>
  );
}
