import { useTranslation } from "react-i18next";

import { ErrorScreen } from "@/shared/error-handling/ErrorScreen";

type DatabaseErrorScreenProps = {
  error: Error;
};

export function DatabaseErrorScreen({ error }: DatabaseErrorScreenProps) {
  const { t } = useTranslation("common");
  return (
    <ErrorScreen
      title={t("Données indisponibles")}
      message={t("Vos données n’ont pas pu être chargées. Essayez de fermer puis relancer Pilbo.")}
      details={error.message}
    />
  );
}
