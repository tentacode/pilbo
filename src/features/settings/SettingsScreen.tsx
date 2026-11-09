import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { AboutSection } from "./components/AboutSection";
import { AppearanceRow } from "./components/AppearanceRow";
import { DebugSection } from "./components/DebugSection";
import { DefaultIntervalRow } from "./components/DefaultIntervalRow";
import { FeedbackSection } from "./components/FeedbackSection";
import { LanguageRow } from "./components/LanguageRow";
import { LowStockRow } from "./components/LowStockRow";
import { LowStockSoundRow } from "./components/LowStockSoundRow";
import { NotificationsRow } from "./components/NotificationsRow";
import { PrivacyCard } from "./components/PrivacyCard";
import { ReminderSoundRow } from "./components/ReminderSoundRow";
import { SettingsSection } from "./components/SettingsSection";
import { useDebugModeToggle } from "./hooks/useDebugModeToggle";
import { useRevealDebugSection } from "./hooks/useRevealDebugSection";
import { styles } from "./SettingsScreen.styles";

export function SettingsScreen() {
  const { t } = useTranslation("settings");
  const { isDebugMode, registerPress } = useDebugModeToggle();
  const { scrollViewReference, onDebugSectionLayout } = useRevealDebugSection(isDebugMode);

  return (
    <Screen ref={scrollViewReference}>
      <ScreenHeader title={t("Réglages")} />
      <View style={styles.sections}>
        <SettingsSection
          title={t("Rappels")}
          help={t("Utilisés pour les nouvelles prises. Chaque prise peut avoir les siens.")}
        >
          <NotificationsRow />
          <DefaultIntervalRow />
          <ReminderSoundRow />
        </SettingsSection>
        <SettingsSection title={t("Stock")}>
          <LowStockRow />
          <LowStockSoundRow />
        </SettingsSection>
        <SettingsSection title={t("Affichage")}>
          <LanguageRow />
          <AppearanceRow />
        </SettingsSection>
        <SettingsSection title={t("Vos données")}>
          <PrivacyCard />
        </SettingsSection>
        <FeedbackSection />
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
