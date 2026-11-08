import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import type { IconName } from "@/design-system/components/Icon/iconShapes";
import { Text, type TextTone } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { type ColorName, sizes } from "@/design-system/tokens";

import { formatIntakeStatus } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { styles, useAppearanceStyles } from "./IntakeStatusLabel.styles";

type Appearance = keyof ReturnType<typeof useAppearanceStyles>;

const APPEARANCES: Record<Appearance, { icon: IconName; tone: TextTone; iconColor: ColorName }> = {
  upcoming: { icon: "clock", tone: "primary", iconColor: "ink" },
  late: { icon: "alert", tone: "onAlert", iconColor: "onAlert" },
  taken: { icon: "checkCircle", tone: "success", iconColor: "successInk" },
  skipped: { icon: "dashCircle", tone: "secondary", iconColor: "inkSecondary" },
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
  const appearanceStyles = useAppearanceStyles();
  const themeColors = useThemeColors();
  const { text, accessibilityLabel } = formatIntakeStatus(t, todayIntake);
  const appearance = appearanceOf(todayIntake);
  const { icon, tone, iconColor } = APPEARANCES[appearance];

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.chip, appearanceStyles[appearance]]}
    >
      <Icon name={icon} size={sizes.iconSmall} color={themeColors[iconColor]} />
      <Text variant="helpBold" tone={tone} style={styles.text}>
        {text}
      </Text>
    </View>
  );
}
