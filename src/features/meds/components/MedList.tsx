import { View } from "react-native";

import { FormGroup } from "@/features/pillbox/components/FormGroup";
import type { MedListItem } from "@/features/meds/utils/medsTypes";
import { MedListRow } from "./MedListRow";
import { useStyles } from "./MedList.styles";

type MedListProps = {
  items: MedListItem[];
  onMedPress: (medId: string) => void;
};

export function MedList({ items, onMedPress }: MedListProps) {
  const styles = useStyles();
  return (
    <FormGroup>
      {items.map((item, index) => (
        <View key={item.med.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <MedListRow item={item} onPress={() => onMedPress(item.med.id)} />
        </View>
      ))}
    </FormGroup>
  );
}
