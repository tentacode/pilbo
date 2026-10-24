import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Pill } from "@/design-system/components/Pill/Pill";
import { sizes } from "@/design-system/tokens";
import type { Med, PillDesign } from "@/domain/med";

import { formatPillDescriptionParts } from "@/features/pillbox/utils/formatters";
import { styles } from "./AppearancePreview.styles";
import { MedName } from "./MedName";

type AppearancePreviewProps = {
  design: PillDesign;
  med: Pick<Med, "name" | "strength">;
  context: string;
};

export function AppearancePreview({ design, med, context }: AppearancePreviewProps) {
  const { t } = useTranslation("pillbox");
  return (
    <View style={styles.preview}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={t("Aperçu : {{description}}", {
          description: formatPillDescriptionParts(t, design).join(", "),
        })}
        style={styles.largePill}
      >
        <Pill design={design} displaySize={sizes.pillPreviewLarge} />
      </View>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.row}
      >
        <Pill design={design} displaySize={sizes.pillInRow} />
        <View style={styles.texts}>
          <MedName med={{ ...med, detail: context }} />
        </View>
      </View>
    </View>
  );
}
