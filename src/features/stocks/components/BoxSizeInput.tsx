import { TextInput, View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { BOX_SIZE } from "@/domain/stock";

import { styles } from "./BoxSizeInput.styles";

type BoxSizeInputProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function BoxSizeInput({ value, error, onChange }: BoxSizeInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        keyboardType="number-pad"
        selectTextOnFocus
        accessibilityLabel="Taille d’une boîte, en comprimés"
        accessibilityHint={error}
        onChangeText={(text) =>
          onChange(text.replace(/\D/g, "").slice(0, String(BOX_SIZE.maximum).length))
        }
        style={[styles.input, error !== undefined && styles.invalidInput]}
      />
      <Text tone="secondary" accessibilityElementsHidden>
        comprimés
      </Text>
    </View>
  );
}
