import type { ReactNode, Ref } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../../tokens";
import { styles } from "./Screen.styles";

type ScreenProps = {
  children: ReactNode;
  ref?: Ref<ScrollView>;
};

export function Screen({ children, ref }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      ref={ref}
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.medium }]}
    >
      {children}
    </ScrollView>
  );
}
