import { Dialog } from "@/design-system/components/Dialog/Dialog";
import type { Med } from "@/domain/med";

import { formatStocksBelowZeroMessage } from "@/features/stocks/utils/formatters";

type StocksBelowZeroDialogProps = {
  meds: Med[];
  onShowStocks: () => void;
  onClose: () => void;
};

export function StocksBelowZeroDialog({ meds, onShowStocks, onClose }: StocksBelowZeroDialogProps) {
  return (
    <Dialog
      isVisible={meds.length > 0}
      icon="pillAlert"
      tone="warning"
      title="Stock à mettre à jour"
      message={formatStocksBelowZeroMessage(meds)}
      confirmAction={{ label: "Voir le stock", onPress: onShowStocks }}
      cancelAction={{ label: "Plus tard", onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
