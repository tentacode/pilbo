import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";

import { MedsEmptyIllustration } from "./MedsEmptyIllustration";
import { styles } from "./MedsEmptyState.styles";

type MedsEmptyStateProps = {
  onCreateMed: () => void;
};

export function MedsEmptyState({ onCreateMed }: MedsEmptyStateProps) {
  const { t } = useTranslation("meds");
  return (
    <View style={styles.container}>
      <MedsEmptyIllustration />
      <Text variant="lead" style={styles.text}>
        {t("Ajoutez vos médicaments : suivez leur stock et prenez-les quand vous voulez.")}
      </Text>
      <Button label={t("Nouveau médicament")} icon="plus" onPress={onCreateMed} />
    </View>
  );
}
