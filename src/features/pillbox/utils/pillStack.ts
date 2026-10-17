import type { MedQuantity } from "@/domain/med";

const MAXIMUM_VISIBLE_PILLS = 4;

export type PillStackLayout = {
  pillSlotCount: number;
  hasHiddenCountSlot: boolean;
};

export function visiblePillCount(quantity: number): number {
  return Math.min(Math.max(quantity, 1), MAXIMUM_VISIBLE_PILLS);
}

export function pillStackLayoutOf(medQuantities: MedQuantity[]): PillStackLayout {
  return {
    pillSlotCount: Math.max(1, ...medQuantities.map(({ quantity }) => visiblePillCount(quantity))),
    hasHiddenCountSlot: medQuantities.some(({ quantity }) => quantity > MAXIMUM_VISIBLE_PILLS),
  };
}

export function pillStackWidth(pillSlotCount: number, pillSize: number, overlapRatio: number) {
  return pillSize * (1 + (pillSlotCount - 1) * (1 - overlapRatio));
}
