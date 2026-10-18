import Svg, { Circle, Path, Rect } from "react-native-svg";

import { IllustrationCapsulePill } from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors, sizes } from "@/design-system/tokens";

const GRID_OPACITY = 0.28;
const TRAJECTORY_OPACITY = 0.5;

export function PillboxEmptyIllustration() {
  return (
    <Svg
      width={sizes.pageEmptyIllustrationWidth}
      height={sizes.pageEmptyIllustrationHeight}
      viewBox="0 0 220 186"
      accessible={false}
    >
      <Circle cx={110} cy={106} r={80} fill={colors.accentSoft} />
      <Rect
        x={44}
        y={50}
        width={132}
        height={120}
        rx={28}
        fill={colors.surface}
        {...strokes.filled}
      />
      <Path d="M110 62v96M56 110h108" {...strokes.outline} opacity={GRID_OPACITY} />
      <Path d="M198 70c-4 16-14 28-30 34" {...strokes.dashed} opacity={TRAJECTORY_OPACITY} />
      <IllustrationCapsulePill
        x={152}
        y={2}
        size={64}
        tilt={-50}
        firstHalfColor={colors.roseStrong}
        secondHalfColor={colors.surface}
      />
    </Svg>
  );
}
