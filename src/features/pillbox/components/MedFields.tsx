import { TextField } from "@/design-system/components/TextField/TextField";

import type { MedDraft } from "@/features/pillbox/utils/medDraft";
import { FormGroup } from "./FormGroup";

type MedFieldsProps = {
  draft: MedDraft;
  nameError?: string;
  onChange: (changes: Partial<MedDraft>) => void;
};

export function MedFields({ draft, nameError, onChange }: MedFieldsProps) {
  return (
    <FormGroup>
      <TextField
        label="Nom"
        value={draft.name}
        error={nameError}
        autoCapitalize="sentences"
        onChangeText={(name) => onChange({ name })}
      />
      <TextField
        label="Dosage (facultatif)"
        value={draft.strength}
        hasTopBorder
        onChangeText={(strength) => onChange({ strength })}
      />
      <TextField
        label="Détail (facultatif)"
        value={draft.detail}
        hasTopBorder
        autoCapitalize="sentences"
        onChangeText={(detail) => onChange({ detail })}
      />
    </FormGroup>
  );
}
