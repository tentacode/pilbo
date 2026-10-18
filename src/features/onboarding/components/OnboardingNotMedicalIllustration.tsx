import Svg, { Path } from "react-native-svg";

import {
  IllustrationCapsulePill,
  IllustrationRoundPill,
  IllustrationSmallRoundPill,
  IllustrationTabletPill,
} from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors } from "@/design-system/tokens";

import type { IllustrationProps } from "./onboardingSteps";

const NOTE_LINES = ["M62 104h66", "M62 128h66", "M62 152h48", "M62 176h66", "M62 200h36"];
const NOTE_LINE_OPACITY = 0.45;

export function OnboardingNotMedicalIllustration({ size }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" accessible={false}>
      <Path
        d="M150 72C120 60 82 60 40 68v170c42-8 80-8 110 4z"
        fill={colors.surface}
        {...strokes.filled}
      />
      <Path
        d="M150 72c30-12 68-12 110-4v170c-42-8-80-8-110 4z"
        fill={colors.surface}
        {...strokes.filled}
      />
      {NOTE_LINES.map((line) => (
        <Path key={line} d={line} {...strokes.outline} opacity={NOTE_LINE_OPACITY} />
      ))}
      <Path d="M226 63v44l11-9 11 9V64" fill={colors.roseStrong} {...strokes.filled} />
      <IllustrationRoundPill x={168} y={94} size={48} color={colors.lavender} />
      <IllustrationCapsulePill
        x={198}
        y={128}
        size={52}
        firstHalfColor={colors.roseStrong}
        secondHalfColor={colors.surface}
      />
      <IllustrationTabletPill x={164} y={160} size={48} color={colors.turquoise} />
      <IllustrationSmallRoundPill x={208} y={184} color={colors.butter} />
    </Svg>
  );
}
