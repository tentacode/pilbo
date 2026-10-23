import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { AboutSection } from "./components/AboutSection";
import { DebugSection } from "./components/DebugSection";
import { DefaultIntervalRow } from "./components/DefaultIntervalRow";
import { LanguageRow } from "./components/LanguageRow";
import { LowStockRow } from "./components/LowStockRow";
import { NotificationsRow } from "./components/NotificationsRow";
import { PrivacyCard } from "./components/PrivacyCard";
import { SettingsSection } from "./components/SettingsSection";
import { useAppLanguage } from "./hooks/useAppLanguage";
import { useDebugModeToggle } from "./hooks/useDebugModeToggle";
import { useRevealDebugSection } from "./hooks/useRevealDebugSection";
import { styles } from "./SettingsScreen.styles";

const SCREEN_TITLES = { fr: "Réglages", en: "Settings" } as const;

export function SettingsScreen() {
  const language = useAppLanguage();
  const { isDebugMode, registerPress } = useDebugModeToggle();
  const { scrollViewReference, onDebugSectionLayout } = useRevealDebugSection(isDebugMode);

  return (
    <Screen ref={scrollViewReference}>
      <ScreenHeader title={SCREEN_TITLES[language]} />
      <View style={styles.sections}>
        <SettingsSection
          title="Rappels"
          help="Utilisé pour les nouvelles prises. Chaque prise peut avoir le sien."
        >
          <NotificationsRow />
          <DefaultIntervalRow />
        </SettingsSection>
        <SettingsSection title="Stock">
          <LowStockRow />
        </SettingsSection>
        <SettingsSection title="Langue">
          <LanguageRow />
        </SettingsSection>
        <SettingsSection title="Vos données">
          <PrivacyCard />
        </SettingsSection>
        <AboutSection onVersionPress={registerPress} />
        {isDebugMode ? (
          <View onLayout={onDebugSectionLayout}>
            <DebugSection />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
