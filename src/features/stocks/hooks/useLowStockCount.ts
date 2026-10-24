import { useLowStockMedIds } from "./useLowStockMedIds";

export function useLowStockCount(): number {
  return useLowStockMedIds().length;
}
