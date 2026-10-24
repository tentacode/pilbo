import { useState } from "react";
import { type AccessibilityActionEvent, Pressable, TextInput, View } from "react-native";

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
  isEditable?: boolean;
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
  isEditable = false,
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
      {isEditable ? (
        <StepperInput value={value} min={min} max={max} label={labels.value} onChange={onChange} />
      ) : (
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
      )}
      <StepperButton
        icon="plus"
        label={labels.increment}
        isDisabled={!canIncrement}
        onPress={increment}
      />
    </View>
  );
}

type StepperInputProps = {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
};

function StepperInput({ value, min, max, label, onChange }: StepperInputProps) {
  const [editingText, setEditingText] = useState<string | null>(null);

  const valueOf = (digits: string) =>
    Math.min(max, Math.max(min, digits === "" ? min : Number(digits)));
  const isEditingText = editingText !== null && valueOf(editingText) === value;

  function handleChangeText(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, String(max).length);
    setEditingText(digits);
    onChange(valueOf(digits));
  }

  return (
    <TextInput
      value={isEditingText ? editingText : String(value)}
      keyboardType="number-pad"
      selectTextOnFocus
      accessibilityLabel={label}
      onFocus={() => setEditingText(String(value))}
      onChangeText={handleChangeText}
      onBlur={() => setEditingText(null)}
      style={styles.input}
    />
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
