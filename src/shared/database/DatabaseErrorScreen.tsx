import { ErrorScreen } from "@/shared/error-handling/ErrorScreen";

type DatabaseErrorScreenProps = {
  error: Error;
};

export function DatabaseErrorScreen({ error }: DatabaseErrorScreenProps) {
  return (
    <ErrorScreen
      title="Données indisponibles"
      message="Vos données n’ont pas pu être chargées. Essayez de fermer puis relancer Pilbo."
      details={error.message}
    />
  );
}
