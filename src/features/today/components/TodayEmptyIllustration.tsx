import Svg, { Circle, Path } from "react-native-svg";

import { colors, sizes } from "@/design-system/tokens";

const STROKE_WIDTH = 2.5;

const outline = {
  fill: "none",
  stroke: colors.ink,
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function TodayEmptyIllustration() {
  return (
    <Svg
      width={sizes.emptyIllustrationWidth}
      height={sizes.emptyIllustrationHeight}
      viewBox="0 0 160 120"
      accessible={false}
    >
      <Circle cx={80} cy={66} r={50} fill={colors.butterSoft} />
      <Path d="M66 40c-4-6 4-9 0-15" {...outline} />
      <Path d="M80 38c-4-6 4-9 0-15" {...outline} />
      <Path d="M94 40c-4-6 4-9 0-15" {...outline} />
      <Path
        d="M52 50h56v30a20 20 0 0 1-20 20H72a20 20 0 0 1-20-20z"
        {...outline}
        fill={colors.turquoise}
      />
      <Path d="M108 58h5a11 11 0 0 1 0 22h-6" {...outline} />
      <Path d="M40 108h80" {...outline} />
    </Svg>
  );
}
