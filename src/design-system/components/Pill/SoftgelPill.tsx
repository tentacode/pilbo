import { Ellipse, G, Path } from "react-native-svg";

import { colors as tokenColors } from "../../tokens";
import { PILL_CENTER, PILL_ROTATION, pillStrokes } from "./Pill.styles";

type SoftgelPillProps = {
  colors: [string, string];
  scale: number;
  outlineRatio: number;
};

export function SoftgelPill({ colors, scale, outlineRatio }: SoftgelPillProps) {
  const strokes = pillStrokes(scale, outlineRatio);
  const [firstHalfColor, secondHalfColor] = colors;
  return (
    <G rotation={PILL_ROTATION} originX={PILL_CENTER} originY={PILL_CENTER}>
      <Ellipse cx={20} cy={20} rx={12} ry={8.5} fill={secondHalfColor} />
      <Path d="M20 11.5a12 8.5 0 0 0 0 17z" fill={firstHalfColor} />
      <Ellipse cx={20} cy={20} rx={12} ry={8.5} fill="none" {...strokes.outline} />
      <Ellipse
        cx={17.8}
        cy={15.5}
        rx={3.4}
        ry={1.7}
        fill={tokenColors.pillHighlight}
        opacity={0.8}
      />
    </G>
  );
}
