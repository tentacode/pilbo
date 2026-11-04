import Svg, { Circle, Path, Rect } from "react-native-svg";

import {
  IllustrationCapsulePill,
  IllustrationRoundPill,
  IllustrationTabletPill,
} from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors, sizes } from "@/design-system/tokens";

export function MedsEmptyIllustration() {
  return (
    <Svg
      width={sizes.pageEmptyIllustrationWidth}
      height={sizes.pageEmptyIllustrationHeight}
      viewBox="0 0 220 186"
      accessible={false}
    >
      <Circle cx={110} cy={106} r={80} fill={colors.accentSoft} />
      <Rect
        x={84}
        y={36}
        width={100}
        height={124}
        rx={12}
        fill={colors.surface}
        {...strokes.filled}
      />
      <Path d="M84 78h100M84 118h100" {...strokes.outline} />
      <Rect x={96} y={54} width={24} height={24} rx={4} fill={colors.butter} {...strokes.filled} />
      <IllustrationCapsulePill
        x={128}
        y={46}
        tilt={-20}
        firstHalfColor={colors.roseStrong}
        secondHalfColor={colors.surface}
      />
      <Rect
        x={103}
        y={87}
        width={14}
        height={7}
        rx={2}
        fill={colors.roseStrong}
        {...strokes.filled}
      />
      <Rect
        x={98}
        y={94}
        width={24}
        height={24}
        rx={6}
        fill={colors.turquoise}
        {...strokes.filled}
      />
      <IllustrationRoundPill x={134} y={92} size={28} color={colors.lavender} />
      <IllustrationTabletPill x={102} y={126} color={colors.turquoise} />
      <IllustrationRoundPill x={146} y={132} size={28} color={colors.butter} />
      <Path d="M84 36L50 48v100l34 12z" fill={colors.surface} {...strokes.filled} />
      <Rect x={64} y={86} width={7} height={24} rx={2} fill={colors.roseStrong} />
      <Rect x={55.5} y={94.5} width={24} height={7} rx={2} fill={colors.roseStrong} />
      <Circle cx={78} cy={98} r={2.5} fill={colors.ink} />
    </Svg>
  );
}
