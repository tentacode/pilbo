import { router } from "expo-router";
import { useRef, useState } from "react";
import { AccessibilityInfo, type ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";

import { AppearancePreview } from "./components/AppearancePreview";
import { ColorField } from "./components/ColorField";
import { CustomColorPanel } from "./components/CustomColorPanel";
import { ShapeField } from "./components/ShapeField";
import { SizeField } from "./components/SizeField";
import type { Med, PillDesign } from "@/domain/med";
import { useColorEditing } from "./hooks/useColorEditing";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { useMedDraftContext } from "./hooks/useMedDraft";
import { DEFAULT_PILL_DESIGN } from "./utils/medDraft";
import { formatPreviewLabel } from "./utils/formatters";
import { randomPillDesign, withShape } from "./utils/pillDesign";
import { styles } from "./AppearanceScreen.styles";
import { formatIntakeTime } from "@/shared/i18n/formatters";

type AppearanceScreenProps = {
  initialDesign: PillDesign;
  previewMed: Pick<Med, "name" | "strength">;
  previewContext: string;
  onValidate: (design: PillDesign) => void;
};

export function AppearanceScreen({
  initialDesign,
  previewMed,
  previewContext,
  onValidate,
}: AppearanceScreenProps) {
  const { t } = useTranslation("pillbox");
  const [design, setDesign] = useState(initialDesign);
  const colorEditing = useColorEditing(design, setDesign);
  const reduceMotion = useReduceMotion();
  const scrollReference = useRef<ScrollView>(null);
  const isCustomColorPanelRevealRequested = useRef(false);

  function openCustomColorPanel() {
    isCustomColorPanelRevealRequested.current = true;
    colorEditing.openCustomColorPanel();
  }

  function randomizeDesign() {
    const randomDesign = randomPillDesign(design);
    colorEditing.closeCustomColorPanel();
    setDesign(randomDesign);
    AccessibilityInfo.announceForAccessibility(formatPreviewLabel(t, randomDesign));
  }

  function revealCustomColorPanel() {
    if (isCustomColorPanelRevealRequested.current) {
      isCustomColorPanelRevealRequested.current = false;
      requestAnimationFrame(() =>
        scrollReference.current?.scrollToEnd({ animated: !reduceMotion }),
      );
    }
  }

  return (
    <Sheet
      title={t("Apparence")}
      leftAction={{ label: t("Annuler"), onPress: () => router.back() }}
      footer={<Button label={t("Valider")} icon="check" onPress={() => onValidate(design)} />}
      scrollReference={scrollReference}
    >
      <View style={styles.content}>
        <AppearancePreview
          design={design}
          med={previewMed}
          context={previewContext}
          onRandomize={randomizeDesign}
        />
        <ShapeField design={design} onChange={(shape) => setDesign(withShape(design, shape))} />
        <SizeField size={design.size} onChange={(size) => setDesign({ ...design, size })} />
        <ColorField
          design={design}
          activeHalf={colorEditing.activeHalf}
          isCustomColorPanelOpen={colorEditing.isCustomColorPanelOpen}
          onActiveHalfChange={colorEditing.selectHalf}
          onColorChange={colorEditing.selectSwatchColor}
          onCustomColorPress={openCustomColorPanel}
        >
          {colorEditing.isCustomColorPanelOpen ? (
            <CustomColorPanel
              {...colorEditing.customColor}
              onChange={colorEditing.changeCustomColor}
              onLayout={revealCustomColorPanel}
            />
          ) : null}
        </ColorField>
      </View>
    </Sheet>
  );
}

function DraftAppearanceScreen({ previewContext }: { previewContext?: string }) {
  const { t } = useTranslation("pillbox");
  const { draft, setDraft } = useMedDraftContext();
  return (
    <AppearanceScreen
      initialDesign={draft?.design ?? DEFAULT_PILL_DESIGN}
      previewMed={{
        name: draft?.name.trim() || t("Votre médicament"),
        strength: draft?.strength.trim() ?? "",
      }}
      previewContext={previewContext ?? draft?.detail.trim() ?? ""}
      onValidate={(design) => {
        setDraft((current) => (current === null ? current : { ...current, design }));
        router.back();
      }}
    />
  );
}

export function IntakeAppearanceScreen() {
  const { draft } = useIntakeDraft();
  return <DraftAppearanceScreen previewContext={formatIntakeTime(draft.time)} />;
}

export function MedsAppearanceScreen() {
  return <DraftAppearanceScreen />;
}
