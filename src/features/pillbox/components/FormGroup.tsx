import type { ReactNode } from "react";
import { View } from "react-native";

import { styles } from "./FormGroup.styles";

export function FormGroup({ children }: { children: ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}
