import { View } from "react-native";

import { useStyles } from "./SheetTop.styles";

export function SheetTop() {
  const styles = useStyles();
  return <View style={styles.grabber} />;
}
