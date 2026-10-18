import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { IntakeList } from "./components/IntakeList";
import { PillboxEmptyState } from "./components/PillboxEmptyState";
import { UnscheduledSection } from "./components/UnscheduledSection";
import { usePillboxData } from "@/features/pillbox/hooks/usePillboxData";

export function PillboxScreen() {
  const { intakes, asNeededMeds } = usePillboxData();
  const isEmpty = intakes.length === 0 && asNeededMeds.length === 0;

  return (
    <Screen>
      <ScreenHeader
        title="Pilulier"
        action={<IconButton icon="plus" accessibilityLabel="Nouvelle prise" />}
      />
      {isEmpty ? (
        <PillboxEmptyState />
      ) : (
        <>
          <IntakeList intakes={intakes} />
          <UnscheduledSection meds={asNeededMeds} />
        </>
      )}
    </Screen>
  );
}
