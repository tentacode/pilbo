import { Stack } from "expo-router";

import { MedDraftProvider } from "@/features/pillbox/hooks/useMedDraft";

export default function AsNeededLayout() {
  return (
    <MedDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </MedDraftProvider>
  );
}
