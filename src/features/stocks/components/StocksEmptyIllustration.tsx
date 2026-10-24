import Svg, { Circle, Path, Rect } from "react-native-svg";

import { IllustrationRoundPill } from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors, sizes } from "@/design-system/tokens";

const LABEL_OPACITY = 0.45;

export function StocksEmptyIllustration() {
  return (
    <Svg
      width={sizes.pageEmptyIllustrationWidth}
      height={sizes.pageEmptyIllustrationHeight}
      viewBox="0 0 220 186"
      accessible={false}
    >
      <Circle cx={110} cy={106} r={80} fill={colors.butterSoft} />
      <Path d="M60 86L38 60h54l18 26z" fill={colors.surface} {...strokes.filled} />
      <Path d="M160 86l22-26h-54l-18 26z" fill={colors.surface} {...strokes.filled} />
      <Rect
        x={60}
        y={86}
        width={100}
        height={72}
        rx={10}
        fill={colors.butter}
        {...strokes.filled}
      />
      <Path d="M94 114h32" {...strokes.outline} opacity={LABEL_OPACITY} />
      <IllustrationRoundPill x={160} y={128} size={44} color={colors.lavender} />
    </Svg>
  );
}
