import { Stepper } from "@/design-system/components/Stepper/Stepper";
import { useTranslation } from "react-i18next";

import { LOW_STOCK_DAYS, useSettingsStore } from "../store/settingsStore";
import { formatDayCount } from "../utils/formatters";
import { SettingsRow } from "./SettingsRow";

export function LowStockRow() {
  const { t } = useTranslation("settings");
  const days = useSettingsStore((state) => state.lowStockDays);
  const setDays = useSettingsStore((state) => state.setLowStockDays);

  return (
    <SettingsRow label={t("Stock bas par défaut")}>
      <Stepper
        value={days}
        min={LOW_STOCK_DAYS.minimum}
        max={LOW_STOCK_DAYS.maximum}
        onChange={setDays}
        formatValue={(value) => formatDayCount(t, value)}
        labels={{
          value: t("Stock bas par défaut"),
          decrement: t("Un jour de moins"),
          increment: t("Un jour de plus"),
        }}
      />
    </SettingsRow>
  );
}
