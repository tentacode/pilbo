import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./FormSection.styles";

type FormSectionProps = {
  label?: string;
  help?: string;
  children: ReactNode;
};

export function FormSection({ label, help, children }: FormSectionProps) {
  return (
    <View>
      {label ? (
        <Text variant="smallBold" tone="secondary" accessibilityRole="header" style={styles.label}>
          {label}
        </Text>
      ) : null}
      {children}
      {help ? (
        <Text variant="help" tone="secondary" style={styles.help}>
          {help}
        </Text>
      ) : null}
    </View>
  );
}
