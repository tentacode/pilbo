import { Stepper } from "@/design-system/components/Stepper/Stepper";

import { LOW_STOCK_DAYS, useSettingsStore } from "../store/settingsStore";
import { formatDayCount } from "../utils/formatters";
import { SettingsRow } from "./SettingsRow";

export function LowStockRow() {
  const days = useSettingsStore((state) => state.lowStockDays);
  const setDays = useSettingsStore((state) => state.setLowStockDays);

  return (
    <SettingsRow label="Stock bas par défaut">
      <Stepper
        value={days}
        min={LOW_STOCK_DAYS.minimum}
        max={LOW_STOCK_DAYS.maximum}
        onChange={setDays}
        formatValue={formatDayCount}
        labels={{
          value: "Stock bas par défaut",
          decrement: "Un jour de moins",
          increment: "Un jour de plus",
        }}
      />
    </SettingsRow>
  );
}
