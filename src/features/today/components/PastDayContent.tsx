import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useDayData } from "@/features/today/hooks/useDayData";
import { openIntakeLogEditing } from "@/features/today/utils/openIntakeLogEditing";
import { styles } from "./PastDayContent.styles";
import { EarlierIntakeCard } from "./EarlierIntakeCard";
import { MissedIntakeCard } from "./MissedIntakeCard";
import { PastDayEmptyState } from "./PastDayEmptyState";
import { TakenAsNeededSection } from "./TakenAsNeededSection";
import { TodaySectionTitle } from "./TodaySectionTitle";

type PastDayContentProps = {
  localDate: string;
};

export function PastDayContent({ localDate }: PastDayContentProps) {
  const { t } = useTranslation("today");
  const { dayIntakes, medLogs } = useDayData(localDate);

  return (
    <View style={styles.content}>
      {dayIntakes.length === 0 ? (
        <PastDayEmptyState />
      ) : (
        <View>
          <TodaySectionTitle title={t("Prises prévues")} />
          <View style={styles.list}>
            {dayIntakes.map((dayIntake) => {
              const openEditing = () => openIntakeLogEditing(dayIntake.intake.id, localDate);
              return dayIntake.status === "missed" ? (
                <MissedIntakeCard
                  key={dayIntake.intake.id}
                  todayIntake={dayIntake}
                  onPress={openEditing}
                />
              ) : (
                <EarlierIntakeCard
                  key={dayIntake.intake.id}
                  todayIntake={dayIntake}
                  onPress={openEditing}
                />
              );
            })}
          </View>
        </View>
      )}
      {medLogs.length > 0 ? <TakenAsNeededSection medLogs={medLogs} /> : null}
    </View>
  );
}
