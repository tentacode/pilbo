import { NotMedicalRow } from "./NotMedicalRow";
import { RestartOnboardingRow } from "./RestartOnboardingRow";
import { SettingsSection } from "./SettingsSection";
import { VersionRow } from "./VersionRow";

type AboutSectionProps = {
  onVersionPress: () => void;
};

export function AboutSection({ onVersionPress }: AboutSectionProps) {
  return (
    <SettingsSection title="À propos">
      <RestartOnboardingRow />
      <NotMedicalRow />
      <VersionRow onPress={onVersionPress} />
    </SettingsSection>
  );
}
