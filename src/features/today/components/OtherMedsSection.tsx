import { router } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import type { MedLogOfDay } from "@/features/today/utils/todayTypes";
import { MedLogCard } from "./MedLogCard";
import { styles } from "./OtherMedsSection.styles";
import { TodaySectionTitle } from "./TodaySectionTitle";

type OtherMedsSectionProps = {
  medLogs: MedLogOfDay[];
};

function openMedLog(medLogId: string) {
  router.push({ pathname: "/med-log", params: { medLogId } });
}

export function OtherMedsSection({ medLogs }: OtherMedsSectionProps) {
  const { t } = useTranslation("today");
  if (medLogs.length === 0) {
    return null;
  }
  return (
    <View>
      <TodaySectionTitle title={t("Autres médicaments")} />
      <View style={styles.list}>
        {medLogs.map((medLog) => (
          <MedLogCard key={medLog.id} medLog={medLog} onPress={() => openMedLog(medLog.id)} />
        ))}
      </View>
    </View>
  );
}
