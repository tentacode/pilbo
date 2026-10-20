import { Pressable, View } from "react-native";

import { playPressHaptic } from "../../utils/playPressHaptic";
import { Text } from "../Text/Text";
import { styles } from "./SegmentedControl.styles";

export type SegmentedControlOption<Value extends string | number> = {
  value: Value;
  label: string;
  accessibilityLabel?: string;
};

type SegmentedControlProps<Value extends string | number> = {
  options: SegmentedControlOption<Value>[];
  selectedValue: Value;
  onChange: (value: Value) => void;
  accessibilityLabel: string;
};

export function SegmentedControl<Value extends string | number>({
  options,
  selectedValue,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<Value>) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={styles.control}
    >
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.accessibilityLabel ?? option.label}
            accessibilityState={{ selected: isSelected }}
            onPressIn={playPressHaptic}
            onPress={() => onChange(option.value)}
            style={[styles.option, isSelected && styles.selectedOption]}
          >
            <Text
              variant={isSelected ? "buttonSmall" : "callout"}
              tone={isSelected ? "primary" : "secondary"}
              style={styles.label}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
