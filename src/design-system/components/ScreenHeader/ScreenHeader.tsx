import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "../Text/Text";
import { styles } from "./ScreenHeader.styles";

type ScreenHeaderProps = {
  title: string;
  action?: ReactNode;
};

export function ScreenHeader({ title, action }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {action}
    </View>
  );
}
