import { View } from "react-native";

import { styles } from "./StockProgressBar.styles";

type StockProgressBarProps = {
  ratio: number;
  isLow: boolean;
};

export function StockProgressBar({ ratio, isLow }: StockProgressBarProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.track, isLow && styles.lowTrack]}
    >
      <View style={[styles.fill, isLow && styles.lowFill, { width: `${ratio * 100}%` }]} />
    </View>
  );
}
