import Svg, { Circle, Path } from "react-native-svg";

import { colors, sizes } from "@/design-system/tokens";

const STROKE_WIDTH = 2.5;

const MOON_PATH =
  "M107 75.5 L105.7 78 L104.2 80.4 L102.5 82.6 L100.6 84.6 L98.6 86.5 L96.4 88.2 L94 89.7 L91.5 91 L88.9 92.1 L86.3 92.9 L83.6 93.5 L80.8 93.9 L78 94 L75.2 93.9 L72.4 93.5 L69.7 92.9 L67.1 92.1 L64.5 91 L62 89.7 L59.6 88.2 L57.4 86.5 L55.4 84.6 L53.5 82.6 L51.8 80.4 L50.3 78 L49 75.5 L47.9 72.9 L47.1 70.3 L46.5 67.6 L46.1 64.8 L46 62 L46.1 59.2 L46.5 56.4 L47.1 53.7 L47.9 51.1 L49 48.5 L50.3 46 L51.8 43.6 L53.5 41.4 L55.4 39.4 L57.4 37.5 L59.6 35.8 L62 34.3 L64.5 33 L67.1 31.9 L69.7 31.1 L72.4 30.5 L75.2 30.1 L74.9 30.9 L73.3 32.6 L71.9 34.5 L70.6 36.5 L69.5 38.6 L68.6 40.8 L67.9 43 L67.4 45.3 L67.1 47.6 L67 50 L67.1 52.4 L67.4 54.7 L67.9 57 L68.6 59.2 L69.5 61.4 L70.6 63.5 L71.9 65.5 L73.3 67.4 L74.9 69.1 L76.6 70.7 L78.5 72.1 L80.5 73.4 L82.6 74.5 L84.8 75.4 L87 76.1 L89.3 76.6 L91.6 76.9 L94 77 L96.4 76.9 L98.7 76.6 L101 76.1 L103.2 75.4 L105.4 74.5 L107.5 73.4Z";

const outline = {
  fill: "none",
  stroke: colors.ink,
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function TodayDoneIllustration() {
  return (
    <Svg
      width={sizes.emptyIllustrationWidth}
      height={sizes.emptyIllustrationHeight}
      viewBox="0 0 160 120"
      accessible={false}
    >
      <Circle cx={80} cy={62} r={50} fill={colors.surface} />
      <Path d={MOON_PATH} {...outline} fill={colors.lavender} />
      <Path d="M112 30v10M107 35h10" {...outline} />
      <Path d="M124 56v6M121 59h6" {...outline} />
      <Circle cx={36} cy={40} r={3} fill={colors.ink} />
    </Svg>
  );
}
