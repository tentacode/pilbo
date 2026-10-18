import Svg, { Path, Rect, Text as SvgText } from "react-native-svg";

import { IllustrationRoundPill } from "@/design-system/components/Illustration/IllustrationPills";
import { illustrationStrokes as strokes } from "@/design-system/components/Illustration/illustrationStrokes";
import { colors, fontFamily, fontSize } from "@/design-system/tokens";

import type { IllustrationProps } from "./onboardingSteps";

const LABEL_FONT = {
  fontFamily: fontFamily.bold,
  fontSize: fontSize.small,
  fill: colors.ink,
} as const;

const REMINDERS = [
  { x: 76, y: 140, label: "20:30 · Rappel", color: colors.surface },
  { x: 86, y: 196, label: "20:40 · Rappel", color: colors.surface },
  { x: 96, y: 252, label: "20:50 · Pris", color: colors.successChip },
];

export function OnboardingRemindersIllustration({ size }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" accessible={false}>
      <Path d="M30 50a34 34 0 0 0-8 26" {...strokes.outline} />
      <Path d="M110 50a34 34 0 0 1 8 26" {...strokes.outline} />
      <Path d="M122 34a52 52 0 0 1 12 42" {...strokes.outline} />
      <Path d="M46 102V74a24 24 0 0 1 48 0v28l8 10H38z" fill={colors.butter} {...strokes.filled} />
      <Path d="M62 120a8 8 0 0 0 16 0" {...strokes.outline} />

      {REMINDERS.map(({ x, y, label, color }) => (
        <Rect
          key={label}
          x={x}
          y={y}
          width={196}
          height={44}
          rx={16}
          fill={color}
          {...strokes.filled}
        />
      ))}
      {REMINDERS.map(({ x, y, label }) => (
        <IllustrationRoundPill key={label} x={x + 8} y={y + 2} color={colors.lavender} />
      ))}
      {REMINDERS.map(({ x, y, label }) => (
        <SvgText key={label} x={x + 56} y={y + 27} {...LABEL_FONT}>
          {label}
        </SvgText>
      ))}
      <Path d="M254 274l5 5 10-11" {...strokes.outline} />
    </Svg>
  );
}
