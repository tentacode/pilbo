import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SheetTop() {
  const insets = useSafeAreaInsets();
  return <View testID="sheet-top-inset" style={{ height: insets.top }} />;
}
