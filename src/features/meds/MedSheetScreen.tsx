import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { BackButton } from "@/design-system/components/BackButton/BackButton";
import { Button } from "@/design-system/components/Button/Button";
import { Screen } from "@/design-system/components/Screen/Screen";
import { toLocalDate } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";

import { StocksBelowZeroDialog } from "@/features/stocks/components/StocksBelowZeroDialog";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";
import { ArchiveMedDialog } from "./components/ArchiveMedDialog";
import { ArchiveRefusedDialog } from "./components/ArchiveRefusedDialog";
import { MedIntakesSection } from "./components/MedIntakesSection";
import { MedSheetHeader } from "./components/MedSheetHeader";
import { MedStockSection } from "./components/MedStockSection";
import { MedTakingSection } from "./components/MedTakingSection";
import { ScheduledTakeDialog } from "./components/ScheduledTakeDialog";
import { useMedArchiving } from "./hooks/useMedArchiving";
import { useMedSheetData } from "./hooks/useMedSheetData";
import { useMedTaking } from "./hooks/useMedTaking";
import { formatTakingSummary } from "./utils/formatters";
import { styles } from "./MedSheetScreen.styles";

function backToList() {
  router.navigate("/meds");
}

function openStock(medId: string) {
  router.push({ pathname: "/stock", params: { medId } });
}

function openDayOf(takenAt: string, now: Date) {
  const localDate = takenAt.slice(0, toLocalDate(now).length);
  if (localDate === toLocalDate(now)) {
    router.navigate("/today");
  } else {
    router.push({ pathname: "/day/[date]", params: { date: localDate } });
  }
}

export function MedSheetScreen() {
  const { medId } = useLocalSearchParams<{ medId: string }>();
  const sheetData = useMedSheetData(medId);
  const { med } = sheetData;

  useEffect(() => {
    if (med === undefined) {
      backToList();
    }
  }, [med]);

  if (med === undefined) {
    return null;
  }
  return <MedSheet {...sheetData} med={med} />;
}

type MedSheetProps = Omit<ReturnType<typeof useMedSheetData>, "med"> & {
  med: Med;
};

function MedSheet({ now, med, intakes, stockStatus, takingSummary, refresh }: MedSheetProps) {
  const { t } = useTranslation("meds");
  const language = useLanguage();
  const [isScheduledTakeDialogVisible, setIsScheduledTakeDialogVisible] = useState(false);
  const [isBelowZeroDialogVisible, setIsBelowZeroDialogVisible] = useState(false);
  const taking = useMedTaking(med, refresh, () => setIsBelowZeroDialogVisible(true));
  const archiving = useMedArchiving(med, backToList);
  const isScheduled = intakes.length > 0;
  const { lastTakenAt } = takingSummary;

  function handleTake() {
    if (isScheduled) {
      setIsScheduledTakeDialogVisible(true);
      return;
    }
    taking.take();
  }

  function takeScheduledMed() {
    setIsScheduledTakeDialogVisible(false);
    taking.take();
  }

  function showStockFromDialog() {
    setIsBelowZeroDialogVisible(false);
    openStock(med.id);
  }

  return (
    <Screen>
      <View style={styles.back}>
        <BackButton label={t("Médicaments")} onPress={() => router.back()} />
      </View>
      <View style={styles.content}>
        <MedSheetHeader
          med={med}
          onEditAppearance={() =>
            router.push({ pathname: "/med-appearance", params: { medId: med.id } })
          }
          onEdit={() => router.push({ pathname: "/med", params: { medId: med.id } })}
        />
        <MedTakingSection
          isScheduled={isScheduled}
          summary={formatTakingSummary(t, language, takingSummary, now)}
          lastTakenAt={taking.lastTakenMedLog?.takenAt}
          onTake={handleTake}
          onOpenDay={() => lastTakenAt !== undefined && openDayOf(lastTakenAt, now)}
          onUndo={taking.undo}
        />
        <MedStockSection stockStatus={stockStatus} onOpenStock={() => openStock(med.id)} />
        <MedIntakesSection
          medId={med.id}
          intakes={intakes}
          onOpenIntake={(intakeId) => router.push({ pathname: "/intake", params: { intakeId } })}
        />
        <View style={styles.delete}>
          <Button label={t("Supprimer le médicament")} variant="text" onPress={archiving.request} />
        </View>
      </View>
      <ScheduledTakeDialog
        isVisible={isScheduledTakeDialogVisible}
        intakes={intakes}
        onTake={takeScheduledMed}
        onCancel={() => setIsScheduledTakeDialogVisible(false)}
      />
      <StocksBelowZeroDialog
        meds={isBelowZeroDialogVisible ? [med] : []}
        onShowStocks={showStockFromDialog}
        onClose={() => setIsBelowZeroDialogVisible(false)}
      />
      <ArchiveMedDialog
        isVisible={archiving.isConfirmDialogVisible}
        onArchive={archiving.confirm}
        onCancel={archiving.cancel}
      />
      <ArchiveRefusedDialog intakes={archiving.blockingIntakes} onClose={archiving.closeRefusal} />
    </Screen>
  );
}
