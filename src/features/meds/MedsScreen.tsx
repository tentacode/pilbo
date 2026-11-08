import { router } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";
import { useTabReset } from "@/shared/navigation/useTabReset";

import { MedList } from "./components/MedList";
import { MedsEmptyState } from "./components/MedsEmptyState";
import { useMedsData } from "./hooks/useMedsData";
import { styles } from "./MedsScreen.styles";

function openNewMed() {
  router.push("/med");
}

function openMed(medId: string) {
  router.push({ pathname: "/meds/[medId]", params: { medId } });
}

export function MedsScreen() {
  const { t } = useTranslation("meds");
  const items = useMedsData();
  const scrollViewReference = useTabReset("meds");

  return (
    <Screen ref={scrollViewReference}>
      <ScreenHeader
        title={t("Médicaments")}
        action={
          <IconButton
            icon="plus"
            accessibilityLabel={t("Nouveau médicament")}
            onPress={openNewMed}
          />
        }
      />
      {items.length === 0 ? (
        <MedsEmptyState onCreateMed={openNewMed} />
      ) : (
        <View style={styles.content}>
          <MedList items={items} onMedPress={openMed} />
          <Button label={t("Nouveau médicament")} icon="plus" onPress={openNewMed} />
        </View>
      )}
    </Screen>
  );
}
