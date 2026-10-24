import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { MedPickerScreen } from "@/features/pillbox/MedPickerScreen";
import { StockPickerEmptyState } from "./components/StockPickerEmptyState";
import { useStockedMedIds } from "./hooks/useStockedMedIds";

function openPillbox() {
  router.navigate("/pillbox");
}

export function StockMedPickerScreen() {
  const { t } = useTranslation("stocks");
  const stockedMedIds = useStockedMedIds();
  return (
    <MedPickerScreen
      title={t("Stock d’un médicament")}
      statusLabelOf={(med) => (stockedMedIds.has(med.id) ? t("En stock") : undefined)}
      emptyContent={<StockPickerEmptyState onOpenPillbox={openPillbox} />}
      onSelect={(med) => router.push({ pathname: "/stock", params: { medId: med.id } })}
    />
  );
}
