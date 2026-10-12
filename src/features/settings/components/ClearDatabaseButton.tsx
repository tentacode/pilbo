import { Button } from "@/design-system/components/Button/Button";
import { clearDatabase } from "@/shared/database/clearDatabase";
import { database } from "@/shared/database/database";

export function ClearDatabaseButton() {
  return (
    <Button
      label="Vider la base"
      variant="secondary"
      accessibilityHint="Supprime toutes les prises et tous les médicaments"
      onPress={() => clearDatabase(database)}
    />
  );
}
