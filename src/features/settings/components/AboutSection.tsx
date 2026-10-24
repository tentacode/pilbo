import { NotMedicalRow } from "./NotMedicalRow";
import { RestartOnboardingRow } from "./RestartOnboardingRow";
import { SettingsSection } from "./SettingsSection";
import { VersionRow } from "./VersionRow";
import { useTranslation } from "react-i18next";

type AboutSectionProps = {
  onVersionPress: () => void;
};

export function AboutSection({ onVersionPress }: AboutSectionProps) {
  const { t } = useTranslation("settings");
  return (
    <SettingsSection title={t("À propos")}>
      <RestartOnboardingRow />
      <NotMedicalRow />
      <VersionRow onPress={onVersionPress} />
    </SettingsSection>
  );
}
