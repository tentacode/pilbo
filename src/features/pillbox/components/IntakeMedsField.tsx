import type { MedQuantity } from "@/domain/med";

import { AddMedRow } from "./AddMedRow";
import { FormGroup } from "./FormGroup";
import { FormSection } from "./FormSection";
import { IntakeMedEditRow } from "./IntakeMedEditRow";

type IntakeMedsFieldProps = {
  medQuantities: MedQuantity[];
  onEditMed: (medId: string) => void;
  onQuantityChange: (medId: string, quantity: number) => void;
  onRemove: (medId: string) => void;
  onAddMed: () => void;
};

export function IntakeMedsField({
  medQuantities,
  onEditMed,
  onQuantityChange,
  onRemove,
  onAddMed,
}: IntakeMedsFieldProps) {
  return (
    <FormSection label="Médicaments">
      <FormGroup>
        {medQuantities.map((medQuantity, index) => {
          const medId = medQuantity.med.id;
          return (
            <IntakeMedEditRow
              key={medId}
              {...medQuantity}
              hasTopBorder={index > 0}
              onEditMed={() => onEditMed(medId)}
              onQuantityChange={(quantity) => onQuantityChange(medId, quantity)}
              onRemove={() => onRemove(medId)}
            />
          );
        })}
        <AddMedRow onPress={onAddMed} hasTopBorder={medQuantities.length > 0} />
      </FormGroup>
    </FormSection>
  );
}
