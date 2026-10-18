import Svg, { Circle, Path, Rect } from "react-native-svg";

import {
  IllustrationCapsulePill,
  IllustrationOvalPill,
  IllustrationRoundPill,
  IllustrationSmallRoundPill,
  IllustrationTabletPill,
} from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors } from "@/design-system/tokens";

import type { IllustrationProps } from "./onboardingSteps";

export function OnboardingPrivacyIllustration({ size }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" accessible={false}>
      <Rect
        x={88}
        y={22}
        width={134}
        height={256}
        rx={30}
        fill={colors.surface}
        {...strokes.filled}
      />
      <Path d="M138 42h34" {...strokes.outline} />
      <IllustrationRoundPill x={106} y={74} size={52} color={colors.lavender} />
      <IllustrationTabletPill x={152} y={86} size={56} color={colors.turquoise} />
      <IllustrationCapsulePill
        x={104}
        y={134}
        size={56}
        firstHalfColor={colors.roseStrong}
        secondHalfColor={colors.surface}
      />
      <IllustrationOvalPill x={156} y={146} size={48} color={colors.rose} />
      <IllustrationSmallRoundPill x={122} y={190} size={44} color={colors.butter} />
      <Circle cx={222} cy={236} r={34} fill={colors.turquoise} {...strokes.filled} />
      <Rect x={208} y={232} width={28} height={22} rx={6} {...strokes.outline} />
      <Path d="M214 232v-6a8 8 0 0 1 16 0v6" {...strokes.outline} />
    </Svg>
  );
}
