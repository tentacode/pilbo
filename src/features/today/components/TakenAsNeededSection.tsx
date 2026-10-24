import { View } from "react-native";
import { useTranslation } from "react-i18next";

import type { MedLogOfDay } from "@/features/today/utils/todayTypes";
import { styles } from "./AsNeededSection.styles";
import { TakenAsNeededRow } from "./TakenAsNeededRow";
import { TodaySectionTitle } from "./TodaySectionTitle";

type TakenAsNeededSectionProps = {
  medLogs: MedLogOfDay[];
};

export function TakenAsNeededSection({ medLogs }: TakenAsNeededSectionProps) {
  const { t } = useTranslation("today");
  return (
    <View>
      <TodaySectionTitle title={t("Hors planning")} />
      <View style={styles.card}>
        {medLogs.map((medLog, index) => (
          <TakenAsNeededRow key={medLog.id} medLog={medLog} hasTopBorder={index > 0} />
        ))}
      </View>
    </View>
  );
}
