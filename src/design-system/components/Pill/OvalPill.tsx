import { Ellipse, G } from "react-native-svg";

import { colors } from "../../tokens";
import { PILL_CENTER, PILL_ROTATION, pillStrokes } from "./Pill.styles";

type OvalPillProps = {
  color: string;
  scale: number;
};

export function OvalPill({ color, scale }: OvalPillProps) {
  const strokes = pillStrokes(scale);
  return (
    <G rotation={PILL_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Ellipse cx={20} cy={20} rx={12} ry={8.5} fill={color} {...strokes.outline} />
      <Ellipse cx={17.8} cy={15.5} rx={3.4} ry={1.7} fill={colors.pillHighlight} opacity={0.8} />
    </G>
  );
}
