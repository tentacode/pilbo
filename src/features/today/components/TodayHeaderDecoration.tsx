import Svg, { Circle, G, Path, Rect } from "react-native-svg";

import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { sizes } from "@/design-system/tokens";

import { styles } from "./TodayHeaderDecoration.styles";

export function TodayHeaderDecoration() {
  const themeColors = useThemeColors();
  return (
    <Svg
      width={sizes.headerDecorationWidth}
      height={sizes.headerDecorationHeight}
      viewBox="0 0 390 250"
      accessible={false}
      pointerEvents="none"
      style={styles.decoration}
    >
      <G transform="rotate(-32 330 70)">
        <Path d="M330 20h-60a50 50 0 0 0 0 100h60z" fill={themeColors.roseSoft} />
        <Path d="M330 20h60a50 50 0 0 1 0 100h-60z" fill={themeColors.accentSoft} />
      </G>
      <Circle cx={232} cy={206} r={40} fill={themeColors.butterSoft} />
      <G transform="rotate(28 372 214)">
        <Rect x={330} y={190} width={96} height={48} rx={24} fill={themeColors.turquoiseSoft} />
      </G>
    </Svg>
  );
}
