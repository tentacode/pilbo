import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";

import {
  IllustrationRoundPill,
  IllustrationSmallRoundPill,
  IllustrationTabletPill,
} from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors, fontFamily, fontSize } from "@/design-system/tokens";

import type { IllustrationProps } from "./onboardingSteps";

const TIME_FONT = {
  fontFamily: fontFamily.display,
  fontSize: fontSize.compactTime,
  fill: colors.ink,
} as const;

export function OnboardingIntakesIllustration({ size }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" accessible={false}>
      <Rect
        x={30}
        y={34}
        width={240}
        height={72}
        rx={22}
        fill={colors.doneBackground}
        {...strokes.filled}
      />
      <SvgText x={52} y={79} {...TIME_FONT}>
        08:30
      </SvgText>
      <IllustrationRoundPill x={146} y={50} color={colors.lavender} />
      <IllustrationSmallRoundPill x={178} y={50} color={colors.butter} />
      <Circle cx={240} cy={70} r={14} fill={colors.successChip} {...strokes.filled} />
      <Path d="M233.5 70.5l4.5 4.5 8.5-9" {...strokes.outline} />

      <Rect
        x={30}
        y={122}
        width={240}
        height={72}
        rx={22}
        fill={colors.alertBackground}
        {...strokes.filled}
      />
      <SvgText x={52} y={167} {...TIME_FONT}>
        12:30
      </SvgText>
      <IllustrationTabletPill x={146} y={138} color={colors.surface} />
      <Circle cx={240} cy={158} r={14} fill={colors.alertChip} {...strokes.filled} />
      <Path d="M240 151v8" {...strokes.outline} />
      <Path d="M240 165v.2" {...strokes.outline} />

      <Rect
        x={30}
        y={210}
        width={240}
        height={72}
        rx={22}
        fill={colors.background}
        {...strokes.filled}
      />
      <SvgText x={52} y={255} {...TIME_FONT}>
        20:30
      </SvgText>
      <IllustrationRoundPill x={146} y={226} color={colors.lavender} />
      <IllustrationRoundPill x={174} y={226} color={colors.lavender} />
      <IllustrationTabletPill x={210} y={226} color={colors.turquoise} />
    </Svg>
  );
}
