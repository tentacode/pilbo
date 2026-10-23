import { Children, isValidElement, type ReactNode } from "react";
import { View } from "react-native";

import { FormGroup } from "@/features/pillbox/components/FormGroup";
import { FormSection } from "@/features/pillbox/components/FormSection";

import { styles } from "./SettingsSection.styles";

type SettingsSectionProps = {
  title: string;
  help?: string;
  children: ReactNode;
};

export function SettingsSection({ title, help, children }: SettingsSectionProps) {
  return (
    <FormSection label={title} help={help}>
      <FormGroup>
        {Children.toArray(children).map((row, index) => (
          <View key={isValidElement(row) ? row.key : index} style={index > 0 && styles.separated}>
            {row}
          </View>
        ))}
      </FormGroup>
    </FormSection>
  );
}
