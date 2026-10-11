import type { Med, PillDesign } from "@/domain/med";

export type MedRecord = {
  id: string;
  name: string;
  strength: string;
  design: string;
  isAsNeeded: number;
};

export function toMed(record: MedRecord): Med {
  return {
    id: record.id,
    name: record.name,
    strength: record.strength,
    design: JSON.parse(record.design) as PillDesign,
    isAsNeeded: record.isAsNeeded === 1,
  };
}
