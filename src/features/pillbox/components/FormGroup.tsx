import type { ReactNode } from "react";
import { View } from "react-native";

import { useStyles } from "./FormGroup.styles";

export function FormGroup({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.group}>{children}</View>;
}
