import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";
import type { Med } from "@/domain/med";

import { AsNeededSection } from "./components/AsNeededSection";
import { TodayDoneState } from "./components/TodayDoneState";
import { TodayEmptyState } from "./components/TodayEmptyState";
import { TodayHeader } from "./components/TodayHeader";
import { RemindersDisabledNotice } from "./components/RemindersDisabledNotice";
import { TodayIntakeSections } from "./components/TodayIntakeSections";
import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";
import { LowStockNotice } from "@/features/stocks/components/LowStockNotice";
import { StocksBelowZeroDialog } from "@/features/stocks/components/StocksBelowZeroDialog";
import { useLowStockNotice } from "@/features/stocks/hooks/useLowStockNotice";
import { useAsNeededTaking } from "@/features/today/hooks/useAsNeededTaking";
import { useIntakeValidation } from "@/features/today/hooks/useIntakeValidation";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { styles } from "./TodayScreen.styles";

function openStocks() {
  router.navigate("/stocks");
}

export function TodayScreen() {
  const { date, intakes, sections, asNeededMeds, isEmpty, upcomingIntake, isAllHandled, refresh } =
    useTodayData();
  const [medsBelowZero, setMedsBelowZero] = useState<Med[]>([]);
  const { validatingIntakeId, validate } = useIntakeValidation(intakes, refresh, setMedsBelowZero);
  const asNeededTaking = useAsNeededTaking(refresh, setMedsBelowZero);
  const { isGranted: remindersEnabled, request: enableReminders } = useNotificationPermission();
  const lowStockNotice = useLowStockNotice();

  const handleTake = (intakeId: string) => validate(intakeId, "taken");
  const handleSkip = (intakeId: string) => validate(intakeId, "skipped");

  function showStocksFromDialog() {
    setMedsBelowZero([]);
    openStocks();
  }

  return (
    <Screen>
      <TodayHeader date={date} />
      <View style={styles.content}>
        {remindersEnabled === false ? <RemindersDisabledNotice onEnable={enableReminders} /> : null}
        {lowStockNotice.isVisible ? (
          <LowStockNotice
            lowStockCount={lowStockNotice.lowStockCount}
            onPress={openStocks}
            onDismiss={lowStockNotice.dismiss}
          />
        ) : null}
        {isEmpty ? <TodayEmptyState upcomingIntake={upcomingIntake} /> : null}
        {isAllHandled ? <TodayDoneState /> : null}
        {isEmpty ? null : (
          <TodayIntakeSections
            sections={sections}
            validatingIntakeId={validatingIntakeId}
            onTake={handleTake}
            onSkip={handleSkip}
          />
        )}
        {asNeededMeds.length > 0 ? (
          <AsNeededSection
            asNeededMeds={asNeededMeds}
            onTake={asNeededTaking.take}
            onCancel={asNeededTaking.cancel}
          />
        ) : null}
      </View>
      <StocksBelowZeroDialog
        meds={medsBelowZero}
        onShowStocks={showStocksFromDialog}
        onClose={() => setMedsBelowZero([])}
      />
    </Screen>
  );
}
