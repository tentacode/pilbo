import { Stack, useGlobalSearchParams } from "expo-router";

import { IntakeDraftProvider } from "@/features/pillbox/hooks/useIntakeDraft";
import { MedDraftProvider } from "@/features/pillbox/hooks/useMedDraft";

export default function IntakeLayout() {
  const { intakeId } = useGlobalSearchParams<{ intakeId?: string }>();
  return (
    <IntakeDraftProvider intakeId={intakeId}>
      <MedDraftProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MedDraftProvider>
    </IntakeDraftProvider>
  );
}
