import { Button } from "@/design-system/components/Button/Button";
import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

export function ResetDatabaseButton() {
  return (
    <Button
      label="Réinitialiser la base"
      variant="secondary"
      accessibilityHint="Remplace les données par les données de test"
      onPress={() => resetDatabase(database, { withLogs: __DEV__ })}
    />
  );
}
