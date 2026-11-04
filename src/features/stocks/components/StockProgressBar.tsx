import { View } from "react-native";

import { styles } from "./StockProgressBar.styles";

type StockProgressBarProps = {
  ratio: number;
  isLow: boolean;
  isCompact?: boolean;
};

export function StockProgressBar({ ratio, isLow, isCompact = false }: StockProgressBarProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.track, isCompact ? styles.compactTrack : isLow && styles.lowTrack]}
    >
      <View style={[styles.fill, isLow && styles.lowFill, { width: `${ratio * 100}%` }]} />
    </View>
  );
}
