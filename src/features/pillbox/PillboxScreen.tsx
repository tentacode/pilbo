import { router } from "expo-router";

import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { IntakeList } from "./components/IntakeList";
import { PillboxEmptyState } from "./components/PillboxEmptyState";
import { UnscheduledSection } from "./components/UnscheduledSection";
import { usePillboxData } from "@/features/pillbox/hooks/usePillboxData";

function openNewIntake() {
  router.push("/intake");
}

function openIntake(intakeId: string) {
  router.push({ pathname: "/intake", params: { intakeId } });
}

function openAsNeededMedPicker() {
  router.push("/as-needed/med-picker");
}

function openAsNeededMed(medId: string) {
  router.push({ pathname: "/as-needed/med", params: { medId } });
}

export function PillboxScreen() {
  const { intakes, asNeededMeds } = usePillboxData();
  const isEmpty = intakes.length === 0 && asNeededMeds.length === 0;

  return (
    <Screen>
      <ScreenHeader
        title="Pilulier"
        action={
          <IconButton icon="plus" accessibilityLabel="Nouvelle prise" onPress={openNewIntake} />
        }
      />
      {isEmpty ? (
        <PillboxEmptyState
          onCreateIntake={openNewIntake}
          onAddAsNeededMed={openAsNeededMedPicker}
        />
      ) : (
        <>
          <IntakeList intakes={intakes} onIntakePress={openIntake} />
          <UnscheduledSection
            meds={asNeededMeds}
            onMedPress={openAsNeededMed}
            onAddMed={openAsNeededMedPicker}
          />
        </>
      )}
    </Screen>
  );
}
