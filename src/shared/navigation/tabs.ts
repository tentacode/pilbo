import type { TFunction } from "i18next";

import type { IconName } from "@/design-system/components/Icon/iconShapes";

type Tab = {
  formatLabel: (t: TFunction<"common">) => string;
  icon: IconName;
  formatBadgeLabel?: (t: TFunction<"common">, count: number) => string;
};

export const tabs: Record<string, Tab> = {
  today: {
    formatLabel: (t) => t("Aujourd'hui"),
    icon: "today",
    formatBadgeLabel: (t, count) => t("{{count}} prises à valider", { count }),
  },
  pillbox: { formatLabel: (t) => t("Pilulier"), icon: "pillbox" },
  stocks: {
    formatLabel: (t) => t("Stock"),
    icon: "stocks",
    formatBadgeLabel: (t, count) => t("{{count}} stocks bas", { count }),
  },
  settings: { formatLabel: (t) => t("Réglages"), icon: "settings" },
};
