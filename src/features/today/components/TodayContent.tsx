import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { toLocalDate } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";
import { LowStockNotice } from "@/features/stocks/components/LowStockNotice";
import { StocksBelowZeroDialog } from "@/features/stocks/components/StocksBelowZeroDialog";
import { useLowStockNotice } from "@/features/stocks/hooks/useLowStockNotice";
import { useAsNeededTaking } from "@/features/today/hooks/useAsNeededTaking";
import { useIntakeValidation } from "@/features/today/hooks/useIntakeValidation";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { openIntakeLogEditing } from "@/features/today/utils/openIntakeLogEditing";
import { AsNeededSection } from "./AsNeededSection";
import { RemindersDisabledNotice } from "./RemindersDisabledNotice";
import { styles } from "./TodayContent.styles";
import { TodayDoneState } from "./TodayDoneState";
import { TodayEmptyState } from "./TodayEmptyState";
import { TodayIntakeSections } from "./TodayIntakeSections";

function openStocks() {
  router.navigate("/stocks");
}

export function TodayContent() {
  const { date, intakes, sections, asNeededMeds, isEmpty, upcomingIntake, isAllHandled, refresh } =
    useTodayData();
  const [medsBelowZero, setMedsBelowZero] = useState<Med[]>([]);
  const { validatingIntakeId, validate } = useIntakeValidation(intakes, refresh, setMedsBelowZero);
  const asNeededTaking = useAsNeededTaking(refresh, setMedsBelowZero);
  const { isGranted: remindersEnabled, request: enableReminders } = useNotificationPermission();
  const lowStockNotice = useLowStockNotice();

  const handleTake = (intakeId: string) => validate(intakeId, "taken");
  const handleSkip = (intakeId: string) => validate(intakeId, "skipped");
  const handleEdit = (intakeId: string) => openIntakeLogEditing(intakeId, toLocalDate(date));

  function showStocksFromDialog() {
    setMedsBelowZero([]);
    openStocks();
  }

  return (
    <>
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
            onEdit={handleEdit}
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
    </>
  );
}
