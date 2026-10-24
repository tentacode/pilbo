import { Dialog } from "@/design-system/components/Dialog/Dialog";
import type { Med } from "@/domain/med";
import { useTranslation } from "react-i18next";

import { formatStocksBelowZeroMessage } from "@/features/stocks/utils/formatters";

type StocksBelowZeroDialogProps = {
  meds: Med[];
  onShowStocks: () => void;
  onClose: () => void;
};

export function StocksBelowZeroDialog({ meds, onShowStocks, onClose }: StocksBelowZeroDialogProps) {
  const { t } = useTranslation("stocks");
  return (
    <Dialog
      isVisible={meds.length > 0}
      icon="pillAlert"
      tone="warning"
      title={t("Stock à mettre à jour")}
      message={formatStocksBelowZeroMessage(t, meds)}
      confirmAction={{ label: t("Voir le stock"), onPress: onShowStocks }}
      cancelAction={{ label: t("Plus tard"), onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
