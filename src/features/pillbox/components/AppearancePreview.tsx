import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Pill } from "@/design-system/components/Pill/Pill";
import { sizes } from "@/design-system/tokens";
import type { Med, PillDesign } from "@/domain/med";

import { usePillPop } from "@/features/pillbox/hooks/usePillPop";
import { formatPreviewLabel } from "@/features/pillbox/utils/formatters";
import { styles } from "./AppearancePreview.styles";
import { MedName } from "./MedName";

type AppearancePreviewProps = {
  design: PillDesign;
  med: Pick<Med, "name" | "strength">;
  context: string;
  onRandomize: () => void;
};

export function AppearancePreview({ design, med, context, onRandomize }: AppearancePreviewProps) {
  const { t } = useTranslation("pillbox");
  const { popStyle, pop } = usePillPop();
  return (
    <View style={styles.preview}>
      <Animated.View
        accessible
        accessibilityRole="image"
        accessibilityLabel={formatPreviewLabel(t, design)}
        style={[styles.largePill, popStyle]}
      >
        <Pill design={design} displaySize={sizes.pillPreviewLarge} />
      </Animated.View>
      <View style={styles.randomizeButton}>
        <IconButton
          icon="dice"
          variant="plain"
          accessibilityLabel={t("Apparence aléatoire")}
          onPress={() => {
            pop();
            onRandomize();
          }}
        />
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
