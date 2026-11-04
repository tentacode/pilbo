import { router, useLocalSearchParams } from "expo-router";

import { AppearanceScreen } from "@/features/pillbox/AppearanceScreen";
import { useMedAppearanceEditing } from "./hooks/useMedAppearanceEditing";

export function MedAppearanceScreen() {
  const { medId } = useLocalSearchParams<{ medId: string }>();
  const { med, save } = useMedAppearanceEditing(medId);
  if (med === undefined) {
    return null;
  }
  return (
    <AppearanceScreen
      initialDesign={med.design}
      previewMed={med}
      previewContext={med.detail}
      onValidate={(design) => {
        save(design);
        router.back();
      }}
    />
  );
}
