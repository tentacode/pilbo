export type PillSize = "small" | "medium" | "large";

export type PillDesign =
  | { shape: "round"; color: string; hasScoreLine: boolean; size: PillSize }
  | { shape: "oval"; color: string; size: PillSize }
  | { shape: "capsule"; firstHalfColor: string; secondHalfColor: string; size: PillSize };

export interface Med {
  id: string;
  name: string;
  strength: string;
  design: PillDesign;
}

export interface MedQuantity {
  med: Med;
  quantity: number;
}
