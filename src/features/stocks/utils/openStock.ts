import { router } from "expo-router";

import { leaveWithoutConfirmation } from "@/features/pillbox/hooks/useModalClosing";

export function openStockFromTab(medId: string) {
  leaveWithoutConfirmation(() => router.navigate("/stocks"));
  router.push({ pathname: "/stock", params: { medId } });
}
