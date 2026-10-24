import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";

import { PillboxEmptyIllustration } from "./PillboxEmptyIllustration";
import { styles } from "./PillboxEmptyState.styles";

type PillboxEmptyStateProps = {
  onCreateIntake: () => void;
  onAddAsNeededMed: () => void;
};

export function PillboxEmptyState({ onCreateIntake, onAddAsNeededMed }: PillboxEmptyStateProps) {
  const { t } = useTranslation("pillbox");
  return (
    <View style={styles.container}>
      <PillboxEmptyIllustration />
      <Text variant="mediumHeading" accessibilityRole="header" style={styles.text}>
        {t("Votre pilulier est vide")}
      </Text>
      <Text variant="callout" tone="secondary" style={[styles.text, styles.body]}>
        {t("Une prise regroupe une heure, des jours et les médicaments à prendre ensemble.")}
      </Text>
      <View style={styles.actions}>
        <Button label={t("Créer une prise")} icon="plus" onPress={onCreateIntake} />
        <Button
          label={t("Ajouter un médicament hors planning")}
          variant="text"
          onPress={onAddAsNeededMed}
        />
      </View>
    </View>
  );
}
