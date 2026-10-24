import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { AccessibilityInfo, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import { Stepper } from "@/design-system/components/Stepper/Stepper";
import { Text } from "@/design-system/components/Text/Text";
import { formatMedLabel, type Med } from "@/domain/med";
import { BOX_SIZE, type Stock, STOCK_QUANTITY } from "@/domain/stock";

import { DiscardChangesDialog } from "@/features/pillbox/components/DiscardChangesDialog";
import { useModalClosing } from "@/features/pillbox/hooks/useModalClosing";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { LOW_STOCK_DAYS, useSettingsStore } from "@/features/settings/store/settingsStore";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { BoxSizeInput } from "./components/BoxSizeInput";
import { StockEditHeader } from "./components/StockEditHeader";
import { StockSummaryCard } from "./components/StockSummaryCard";
import { StopTrackingDialog } from "./components/StopTrackingDialog";
import { useStockActions } from "./hooks/useStockActions";
import { useStockEditData } from "./hooks/useStockEditData";
import { formatDayCount, formatMedSchedule, formatThresholdHelp } from "./utils/formatters";
import {
  addBox,
  createStockDraft,
  isStockDraftDirty,
  parseBoxSize,
  type StockDraft,
  toStock,
} from "./utils/stockDraft";
import {
  computeStockForecast,
  countConsumedPills,
  isScheduled,
  stockRatio,
} from "./utils/stockForecast";
import { styles } from "./StockEditScreen.styles";

export function StockEditScreen() {
  const { medId } = useLocalSearchParams<{ medId: string }>();
  const { med, stock, intakes, intakeLogs } = useStockEditData(medId);
  if (med === undefined) {
    return null;
  }
  return <StockEditForm med={med} stock={stock} intakes={intakes} intakeLogs={intakeLogs} />;
}

type StockEditFormProps = Omit<ReturnType<typeof useStockEditData>, "med"> & {
  med: Med;
};

function StockEditForm({ med, stock, intakes, intakeLogs }: StockEditFormProps) {
  const { t } = useTranslation("stocks");
  const now = useCurrentMinute();
  const boxSizeErrorText = t(
    "Indiquez une taille de boîte entre {{minimum}} et {{maximum}} comprimés.",
    {
      minimum: BOX_SIZE.minimum,
      maximum: BOX_SIZE.maximum,
    },
  );
  const defaultLowStockDays = useSettingsStore((state) => state.lowStockDays);
  const [initialDraft] = useState(() => createStockDraft(med.id, stock, defaultLowStockDays));
  const [draft, setDraft] = useState(initialDraft);
  const [boxSizeError, setBoxSizeError] = useState<string>();
  const [isStopDialogVisible, setIsStopDialogVisible] = useState(false);
  const modalClosing = useModalClosing(isStockDraftDirty(draft, initialDraft));
  const stockActions = useStockActions();

  const boxSize = parseBoxSize(draft.boxSizeText);
  const draftStock: Stock = {
    medId: med.id,
    quantity: draft.quantity,
    boxSize: boxSize ?? BOX_SIZE.default,
    lowStockDays: draft.lowStockDays,
  };
  const forecast = computeStockForecast(draftStock, intakes, intakeLogs, now);
  const hasThreshold = isScheduled(med.id, intakes);

  function update(changes: Partial<StockDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function handleBoxSizeChange(boxSizeText: string) {
    setBoxSizeError(undefined);
    update({ boxSizeText });
  }

  function handleSave() {
    const stockToSave = toStock(draft);
    if (stockToSave === undefined) {
      setBoxSizeError(boxSizeErrorText);
      AccessibilityInfo.announceForAccessibility(boxSizeErrorText);
      return;
    }
    stockActions.save(stockToSave);
    modalClosing.close();
  }

  function handleStopTracking() {
    setIsStopDialogVisible(false);
    stockActions.remove(med.id);
    modalClosing.close();
  }

  return (
    <Sheet
      title={stock === undefined ? t("Ajouter un stock") : t("Modifier le stock")}
      leftAction={{ label: t("Annuler"), onPress: modalClosing.requestClose }}
      footer={<Button label={t("Enregistrer")} icon="check" onPress={handleSave} />}
    >
      <View style={styles.content}>
        <StockEditHeader med={med} schedule={formatMedSchedule(t, med, intakes)} />
        <StockSummaryCard
          med={med}
          quantity={draft.quantity}
          forecast={forecast}
          ratio={boxSize === undefined ? 0 : stockRatio(draftStock)}
        />
        <Button
          label={
            boxSize === undefined
              ? t("Ajouter une boîte")
              : t("Ajouter une boîte de {{boxSize}}", { boxSize })
          }
          variant="secondary"
          size="large"
          icon="plus"
          isDisabled={boxSize === undefined}
          onPress={() => setDraft(addBox)}
        />
        <SettingsSection title={t("Corriger le nombre")}>
          <SettingsRow label={t("Comprimés restants")}>
            <Stepper
              value={draft.quantity}
              min={STOCK_QUANTITY.minimum}
              max={STOCK_QUANTITY.maximum}
              onChange={(quantity) => update({ quantity })}
              isEditable
              labels={{
                value: t("Comprimés restants"),
                decrement: t("Un comprimé de moins"),
                increment: t("Un comprimé de plus"),
              }}
            />
          </SettingsRow>
        </SettingsSection>
        <View>
          <SettingsSection
            title={hasThreshold ? t("Stock bas") : t("Boîte")}
            help={
              hasThreshold
                ? formatThresholdHelp(
                    t,
                    countConsumedPills(med.id, draft.lowStockDays, intakes, intakeLogs, now),
                    draft.lowStockDays,
                  )
                : undefined
            }
          >
            {hasThreshold ? (
              <SettingsRow label={t("Me prévenir à")}>
                <Stepper
                  value={draft.lowStockDays}
                  min={LOW_STOCK_DAYS.minimum}
                  max={LOW_STOCK_DAYS.maximum}
                  onChange={(lowStockDays) => update({ lowStockDays })}
                  formatValue={(days) => formatDayCount(t, days)}
                  labels={{
                    value: t("Me prévenir à"),
                    decrement: t("Un jour de moins"),
                    increment: t("Un jour de plus"),
                  }}
                />
              </SettingsRow>
            ) : null}
            <SettingsRow label={t("Taille d’une boîte")}>
              <BoxSizeInput
                value={draft.boxSizeText}
                error={boxSizeError}
                onChange={handleBoxSizeChange}
              />
            </SettingsRow>
          </SettingsSection>
          {boxSizeError === undefined ? null : (
            <Text variant="smallBold" tone="alert" accessibilityElementsHidden style={styles.error}>
              {boxSizeError}
            </Text>
          )}
        </View>
        {stock === undefined ? null : (
          <View style={styles.stopButton}>
            <Button
              label={t("Ne plus suivre le stock")}
              variant="text"
              onPress={() => setIsStopDialogVisible(true)}
            />
          </View>
        )}
      </View>
      <StopTrackingDialog
        isVisible={isStopDialogVisible}
        medLabel={formatMedLabel(med)}
        onConfirm={handleStopTracking}
        onCancel={() => setIsStopDialogVisible(false)}
      />
      <DiscardChangesDialog
        isVisible={modalClosing.isDiscardDialogVisible}
        onDiscard={modalClosing.confirmDiscard}
        onContinue={modalClosing.cancelDiscard}
      />
    </Sheet>
  );
}
