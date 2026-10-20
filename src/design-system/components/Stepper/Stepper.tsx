import { type AccessibilityActionEvent, Pressable, View } from "react-native";

import { playPressHaptic } from "../../utils/playPressHaptic";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text } from "../Text/Text";
import { styles } from "./Stepper.styles";

export type StepperLabels = {
  value: string;
  decrement: string;
  increment: string;
  remove?: string;
};

type StepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onRemove?: () => void;
  formatValue?: (value: number) => string;
  labels: StepperLabels;
};

const ADJUSTABLE_ACTIONS = [{ name: "increment" }, { name: "decrement" }];

export function Stepper({
  value,
  min,
  max,
  onChange,
  onRemove,
  formatValue = String,
  labels,
}: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;
  const isRemoveMode = !canDecrement && onRemove !== undefined;

  function decrement() {
    if (canDecrement) {
      onChange(value - 1);
    }
  }

  function increment() {
    if (canIncrement) {
      onChange(value + 1);
    }
  }

  function handleAccessibilityAction(event: AccessibilityActionEvent) {
    if (event.nativeEvent.actionName === "increment") {
      increment();
    } else if (event.nativeEvent.actionName === "decrement") {
      decrement();
    }
  }

  return (
    <View style={styles.stepper}>
      {isRemoveMode ? (
        <StepperButton icon="trash" label={labels.remove ?? labels.decrement} onPress={onRemove} />
      ) : (
        <StepperButton
          icon="minus"
          label={labels.decrement}
          isDisabled={!canDecrement}
          onPress={decrement}
        />
      )}
      <Text
        variant="bodyBold"
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={labels.value}
        accessibilityValue={{ min, max, now: value, text: formatValue(value) }}
        accessibilityActions={ADJUSTABLE_ACTIONS}
        onAccessibilityAction={handleAccessibilityAction}
        style={styles.value}
      >
        {formatValue(value)}
      </Text>
      <StepperButton
        icon="plus"
        label={labels.increment}
        isDisabled={!canIncrement}
        onPress={increment}
      />
    </View>
  );
}

type StepperButtonProps = {
  icon: IconName;
  label: string;
  isDisabled?: boolean;
  onPress: () => void;
};

function StepperButton({ icon, label, isDisabled = false, onPress }: StepperButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPressIn={playPressHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <Icon name={icon} />
    </Pressable>
  );
}
