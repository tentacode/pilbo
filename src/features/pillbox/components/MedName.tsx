import { Text, type TextTone } from "@/design-system/components/Text/Text";
import type { Med } from "@/domain/med";

type MedNameProps = {
  med: Pick<Med, "name" | "strength" | "detail">;
  tone?: TextTone;
};

export function MedName({ med, tone = "primary" }: MedNameProps) {
  return (
    <>
      <Text variant="bodyBold" tone={tone}>
        {med.name}
        {med.strength === "" ? null : <Text tone={tone}> {med.strength}</Text>}
      </Text>
      {med.detail === "" ? null : (
        <Text variant="small" tone="secondary">
          {med.detail}
        </Text>
      )}
    </>
  );
}
