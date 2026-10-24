import { View, type ColorValue } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import type { IconName } from "@/design-system/components/Icon/iconShapes";
import { Text, type TextTone } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";

import { formatIntakeStatus } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { appearanceStyles, styles } from "./IntakeStatusLabel.styles";

type Appearance = keyof typeof appearanceStyles;

const APPEARANCES: Record<Appearance, { icon: IconName; tone: TextTone; iconColor: ColorValue }> = {
  upcoming: { icon: "clock", tone: "primary", iconColor: colors.ink },
  late: { icon: "alert", tone: "onAlert", iconColor: colors.onAlert },
  taken: { icon: "checkCircle", tone: "success", iconColor: colors.successInk },
  skipped: { icon: "dashCircle", tone: "secondary", iconColor: colors.inkSecondary },
};

function appearanceOf({ status, validation }: TodayIntake): Appearance {
  if (status === "late" || status === "missed" || (status === "taken" && validation?.isTakenLate)) {
    return "late";
  }
  if (status === "taken" || status === "skipped") {
    return status;
  }
  return "upcoming";
}

type IntakeStatusLabelProps = {
  todayIntake: TodayIntake;
};

export function IntakeStatusLabel({ todayIntake }: IntakeStatusLabelProps) {
  const { t } = useTranslation("today");
  const { text, accessibilityLabel } = formatIntakeStatus(t, todayIntake);
  const appearance = appearanceOf(todayIntake);
  const { icon, tone, iconColor } = APPEARANCES[appearance];

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.chip, appearanceStyles[appearance]]}
    >
      <Icon name={icon} size={sizes.iconSmall} color={iconColor} />
      <Text variant="helpBold" tone={tone} style={styles.text}>
        {text}
      </Text>
    </View>
  );
}
