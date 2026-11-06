import { useTranslation } from "react-i18next";

import { FeedbackRow } from "./FeedbackRow";
import { SettingsSection } from "./SettingsSection";

export function FeedbackSection() {
  const { t } = useTranslation("settings");
  return (
    <SettingsSection title={t("Votre avis")}>
      <FeedbackRow label={t("J'ai trouvé un bug")} mailSubject={t("Pilbo : j'ai trouvé un bug")} />
      <FeedbackRow label={t("J'ai une idée")} mailSubject={t("Pilbo : j'ai une idée")} />
    </SettingsSection>
  );
}
