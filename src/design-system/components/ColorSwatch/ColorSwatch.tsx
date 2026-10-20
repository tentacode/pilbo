import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { playPressHaptic } from "../../utils/playPressHaptic";
import { styles } from "./ColorSwatch.styles";

const WHEEL_RADIUS = 20;

type ColorSwatchProps = {
  label: string;
  colors: readonly string[];
  isSelected: boolean;
  onPress: () => void;
};

export function ColorSwatch({ label, colors, isSelected, onPress }: ColorSwatchProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={[styles.swatch, isSelected && styles.selected]}
    >
      <View style={[styles.color, colors.length === 1 && { backgroundColor: colors[0] }]}>
        {colors.length > 1 ? <ColorWheel colors={colors} /> : null}
      </View>
    </Pressable>
  );
}

function pointOnCircle(angle: number): string {
  const x = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(angle);
  const y = WHEEL_RADIUS - WHEEL_RADIUS * Math.cos(angle);
  return `${x} ${y}`;
}

function ColorWheel({ colors }: { colors: readonly string[] }) {
  const sliceAngle = (2 * Math.PI) / colors.length;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 40 40" accessible={false}>
      {colors.map((color, index) => (
        <Path
          key={color}
          d={`M${WHEEL_RADIUS} ${WHEEL_RADIUS}L${pointOnCircle(index * sliceAngle)}A${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${pointOnCircle((index + 1) * sliceAngle)}z`}
          fill={color}
        />
      ))}
    </Svg>
  );
}
