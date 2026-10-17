import type { IconName } from "@/design-system/components/Icon/iconShapes";

export const tabs: Record<
  string,
  { label: string; icon: IconName; formatBadgeLabel?: (count: number) => string }
> = {
  today: {
    label: "Aujourd'hui",
    icon: "today",
    formatBadgeLabel: (count) => (count > 1 ? `${count} prises à valider` : "1 prise à valider"),
  },
  pillbox: { label: "Pilulier", icon: "pillbox" },
  stocks: { label: "Stock", icon: "stocks" },
  settings: { label: "Réglages", icon: "settings" },
};
