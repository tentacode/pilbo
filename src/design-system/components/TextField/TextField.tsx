import { useEffect, useRef } from "react";
import { AccessibilityInfo, Pressable, TextInput, type TextInputProps } from "react-native";

import { colors } from "../../tokens";
import { Text } from "../Text/Text";
import { styles } from "./TextField.styles";

type TextFieldProps = Pick<
  TextInputProps,
  "value" | "onChangeText" | "autoCapitalize" | "returnKeyType" | "onSubmitEditing"
> & {
  label: string;
  error?: string;
  hasTopBorder?: boolean;
};

export function TextField({ label, error, hasTopBorder = false, ...inputProps }: TextFieldProps) {
  const inputReference = useRef<TextInput>(null);

  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);

  return (
    <Pressable
      accessible={false}
      onPress={() => inputReference.current?.focus()}
      style={[styles.field, hasTopBorder && styles.topBorder]}
    >
      <Text variant="helpBold" tone="secondary" accessibilityElementsHidden>
        {label}
      </Text>
      <TextInput
        ref={inputReference}
        accessibilityLabel={label}
        accessibilityHint={error}
        placeholderTextColor={colors.inkSecondary}
        style={styles.input}
        {...inputProps}
      />
      {error ? (
        <Text variant="smallBold" tone="alert" accessibilityElementsHidden>
          {error}
        </Text>
      ) : null}
    </Pressable>
  );
}
