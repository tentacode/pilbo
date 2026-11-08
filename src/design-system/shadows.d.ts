import type { ViewStyle } from "react-native";

import type { ThemeColors } from "./tokens";

export declare function createShadows(themeColors: ThemeColors): {
  raised: ViewStyle;
  floating: ViewStyle;
};
