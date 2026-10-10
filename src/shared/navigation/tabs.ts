import type { IconName } from "@/design-system/components/Icon/iconShapes";

export const tabs: Record<string, { label: string; icon: IconName }> = {
  today: { label: "Aujourd'hui", icon: "today" },
  pillbox: { label: "Pilulier", icon: "pillbox" },
  stocks: { label: "Stock", icon: "stocks" },
  settings: { label: "Réglages", icon: "settings" },
};
