import { useCallback, useState } from "react";
import { type LayoutChangeEvent, Pressable, View } from "react-native";

import { useFitsInWidth } from "../../hooks/useFitsInWidth";
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
  const [requiredWidth, setRequiredWidth] = useState(0);
  const { onLayout, fits } = useFitsInWidth(requiredWidth);
  const isStacked = !fits;

  const onMeasureLayout = useCallback((event: LayoutChangeEvent) => {
    setRequiredWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        onLayout={onLayout}
        style={[styles.control, isStacked && styles.stackedControl]}
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
              style={[
                styles.option,
                isStacked && styles.stackedOption,
                isSelected && styles.selectedOption,
              ]}
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
      <SegmentedControlMeasure
        labels={options.map(({ label }) => label)}
        onLayout={onMeasureLayout}
      />
    </View>
  );
}

type SegmentedControlMeasureProps = {
  labels: string[];
  onLayout: (event: LayoutChangeEvent) => void;
};

// Invisible copy of the options without width constraint: its width is the one needed side by side.
function SegmentedControlMeasure({ labels, onLayout }: SegmentedControlMeasureProps) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.measureContainer}
    >
      <View testID="segmented-control-measure" onLayout={onLayout} style={styles.measureRow}>
        {labels.map((label) => (
          <View key={label} style={styles.measureOption}>
            <Text variant="buttonSmall">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
