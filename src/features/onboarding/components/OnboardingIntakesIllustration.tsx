import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";

import {
  IllustrationRoundPill,
  IllustrationSmallRoundPill,
  IllustrationTabletPill,
} from "@/design-system/components/Illustration/IllustrationPills";
import { useIllustrationStrokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { fontFamily, fontSize } from "@/design-system/tokens";

import type { IllustrationProps } from "./onboardingSteps";

const TIME_FONT = {
  fontFamily: fontFamily.display,
  fontSize: fontSize.compactTime,
} as const;

export function OnboardingIntakesIllustration({ size }: IllustrationProps) {
  const strokes = useIllustrationStrokes();
  const themeColors = useThemeColors();
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" accessible={false}>
      <Rect
        x={30}
        y={34}
        width={240}
        height={72}
        rx={22}
        fill={themeColors.doneBackground}
        {...strokes.filled}
      />
      <SvgText x={52} y={79} {...TIME_FONT} fill={themeColors.ink}>
        08:30
      </SvgText>
      <IllustrationRoundPill x={146} y={50} color={themeColors.lavender} />
      <IllustrationSmallRoundPill x={178} y={50} color={themeColors.butter} />
      <Circle cx={240} cy={70} r={14} fill={themeColors.successChip} {...strokes.filled} />
      <Path d="M233.5 70.5l4.5 4.5 8.5-9" {...strokes.outline} />

      <Rect
        x={30}
        y={122}
        width={240}
        height={72}
        rx={22}
        fill={themeColors.alertBackground}
        {...strokes.filled}
      />
      <SvgText x={52} y={167} {...TIME_FONT} fill={themeColors.ink}>
        12:30
      </SvgText>
      <IllustrationTabletPill x={146} y={138} color={themeColors.surface} />
      <Circle cx={240} cy={158} r={14} fill={themeColors.alertChip} {...strokes.filled} />
      <Path d="M240 151v8" {...strokes.outline} />
      <Path d="M240 165v.2" {...strokes.outline} />

      <Rect
        x={30}
        y={210}
        width={240}
        height={72}
        rx={22}
        fill={themeColors.background}
        {...strokes.filled}
      />
      <SvgText x={52} y={255} {...TIME_FONT} fill={themeColors.ink}>
        20:30
      </SvgText>
      <IllustrationRoundPill x={146} y={226} color={themeColors.lavender} />
      <IllustrationRoundPill x={174} y={226} color={themeColors.lavender} />
      <IllustrationTabletPill x={210} y={226} color={themeColors.turquoise} />
    </Svg>
  );
}
