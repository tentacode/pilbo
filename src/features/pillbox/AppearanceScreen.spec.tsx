import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { PillDesign } from "@/domain/med";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { i18n } from "@/shared/i18n/i18n";

import { AsNeededAppearanceScreen, IntakeAppearanceScreen } from "./AppearanceScreen";
import { IntakeDraftProvider } from "./hooks/useIntakeDraft";
import { MedDraftProvider, useMedDraftContext } from "./hooks/useMedDraft";
import { createMedDraft } from "./utils/medDraft";

const t = i18n.getFixedT(null, "pillbox");

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

let savedDesign: PillDesign | undefined;

function MedDraftSpy() {
  const { draft } = useMedDraftContext();
  useEffect(() => {
    savedDesign = draft?.design;
  });
  return null;
}

function renderAsNeededAppearance() {
  const initialDraft = { ...createMedDraft(t, "asNeeded"), name: "Doliprane", strength: "1 g" };
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <MedDraftProvider initialDraft={initialDraft}>
          <MedDraftSpy />
          {children}
        </MedDraftProvider>
      </SafeAreaProvider>
    );
  }
  return render(<AsNeededAppearanceScreen />, { wrapper });
}

function previewLabel(): string | undefined {
  return screen.getByRole("image", { name: /^Aperçu/ }).props.accessibilityLabel;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
});

describe("AppearanceScreen", () => {
  it("previews the current design with the as needed context", async () => {
    await renderAsNeededAppearance();

    expect(screen.getByRole("header", { name: "Apparence" })).toBeOnTheScreen();
    expect(previewLabel()).toBe("Aperçu : rond, moyenne, lilas");
    expect(screen.getByText("Hors planning", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("Doliprane 1 g", { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it("offers the six shapes, the current one selected", async () => {
    await renderAsNeededAppearance();

    expect(
      screen.getAllByRole("radio", { name: /^(Rond|Ovale|Gélule|Capsule molle|Triangle|Carré)$/ }),
    ).toHaveLength(6);
    expect(screen.getByRole("radio", { name: "Rond" })).toBeSelected();
  });

  it("keeps the colors when choosing another shape", async () => {
    await renderAsNeededAppearance();

    await fireEvent.press(screen.getByRole("radio", { name: "Gélule" }));

    expect(screen.getByRole("radio", { name: "Gélule" })).toBeSelected();
    expect(previewLabel()).toBe("Aperçu : gélule, moyenne, lilas");
  });

  it("offers the triangle shape", async () => {
    await renderAsNeededAppearance();

    await fireEvent.press(screen.getByRole("radio", { name: "Triangle" }));

    expect(previewLabel()).toBe("Aperçu : triangle, moyenne, lilas");
  });

  it("changes the size", async () => {
    await renderAsNeededAppearance();

    await fireEvent.press(screen.getByRole("radio", { name: "Grande" }));

    expect(previewLabel()).toBe("Aperçu : rond, grande, lilas");
  });

  it("colors the first half from the swatches", async () => {
    await renderAsNeededAppearance();

    expect(screen.getByRole("radio", { name: "Couleur 1 : lilas" })).toBeSelected();
    expect(screen.getByRole("radio", { name: "Lilas" })).toBeSelected();
    await fireEvent.press(screen.getByRole("radio", { name: "Jaune" }));

    expect(previewLabel()).toBe("Aperçu : rond, moyenne, jaune et lilas");
    expect(screen.getByRole("radio", { name: "Jaune" })).toBeSelected();
  });

  it("colors the second half", async () => {
    await renderAsNeededAppearance();

    await fireEvent.press(screen.getByRole("radio", { name: "Couleur 2 : lilas" }));
    await fireEvent.press(screen.getByRole("radio", { name: "Menthe" }));

    expect(previewLabel()).toBe("Aperçu : rond, moyenne, lilas et menthe");
    expect(screen.getByRole("radio", { name: "Couleur 2 : menthe" })).toBeSelected();
  });

  it("selects the other color choice", async () => {
    await renderAsNeededAppearance();

    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeCollapsed();

    await fireEvent.press(screen.getByRole("button", { name: "Autre couleur" }));

    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeExpanded();
    expect(screen.getByRole("radio", { name: "Lilas" })).not.toBeSelected();
  });

  it("hides the custom color sliders while a swatch is selected", async () => {
    await renderAsNeededAppearance();

    expect(screen.queryByRole("adjustable", { name: "Teinte" })).not.toBeOnTheScreen();
  });

  it("applies a custom color to the selected half with the sliders", async () => {
    await renderAsNeededAppearance();
    await fireEvent.press(screen.getByRole("radio", { name: "Couleur 2 : lilas" }));
    await fireEvent.press(screen.getByRole("button", { name: "Autre couleur" }));

    const intensity = screen.getByRole("adjustable", { name: "Intensité, du clair au foncé" });
    await fireEvent(intensity, "accessibilityAction", { nativeEvent: { actionName: "increment" } });

    expect(previewLabel()).toBe("Aperçu : rond, moyenne, lilas et couleur personnalisée");
    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeSelected();
  });

  it("shows the sliders for a color outside the swatches", async () => {
    const initialDraft = {
      ...createMedDraft(t, "asNeeded"),
      design: {
        shape: "capsule" as const,
        size: "medium" as const,
        colors: ["#F58FB8", "#FFFFFF"] as [string, string],
      },
    };
    await render(<AsNeededAppearanceScreen />, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <MedDraftProvider initialDraft={initialDraft}>{children}</MedDraftProvider>
        </SafeAreaProvider>
      ),
    });

    expect(screen.getByRole("adjustable", { name: "Teinte" })).toBeOnTheScreen();
  });

  it("keeps the sliders open when switching to the other half", async () => {
    await renderAsNeededAppearance();
    await fireEvent.press(screen.getByRole("button", { name: "Autre couleur" }));

    await fireEvent.press(screen.getByRole("radio", { name: "Couleur 2 : lilas" }));

    expect(screen.getByRole("adjustable", { name: "Teinte" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeSelected();
  });

  it("keeps the sliders closed when switching to a custom colored half", async () => {
    const initialDraft = {
      ...createMedDraft(t, "asNeeded"),
      design: {
        shape: "capsule" as const,
        size: "medium" as const,
        colors: ["#FFFFFF", "#F58FB8"] as [string, string],
      },
    };
    await render(<AsNeededAppearanceScreen />, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <MedDraftProvider initialDraft={initialDraft}>{children}</MedDraftProvider>
        </SafeAreaProvider>
      ),
    });

    await fireEvent.press(screen.getByRole("radio", { name: /^Couleur 2/ }));

    expect(screen.queryByRole("adjustable", { name: "Teinte" })).not.toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Autre couleur" })).toBeCollapsed();
  });

  it("closes the sliders when choosing a swatch", async () => {
    await renderAsNeededAppearance();
    await fireEvent.press(screen.getByRole("button", { name: "Autre couleur" }));

    await fireEvent.press(screen.getByRole("radio", { name: "Menthe" }));

    expect(screen.queryByRole("adjustable", { name: "Teinte" })).not.toBeOnTheScreen();
  });

  it("saves the design in the med draft when validating", async () => {
    await renderAsNeededAppearance();

    await fireEvent.press(screen.getByRole("radio", { name: "Capsule molle" }));
    await fireEvent.press(screen.getByRole("radio", { name: "Petite" }));
    await fireEvent.press(screen.getByRole("button", { name: "Valider" }));

    expect(savedDesign).toEqual({
      shape: "softgel",
      size: "small",
      colors: ["#D6C9F5", "#D6C9F5"],
    });
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("keeps the med draft when cancelling", async () => {
    await renderAsNeededAppearance();

    await fireEvent.press(screen.getByRole("radio", { name: "Ovale" }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(savedDesign?.shape).toBe("round");
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("shows the intake time in the preview from an intake", async () => {
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <IntakeDraftProvider>
            <MedDraftProvider initialDraft={createMedDraft(t, "intake")}>
              {children}
            </MedDraftProvider>
          </IntakeDraftProvider>
        </SafeAreaProvider>
      );
    }
    await render(<IntakeAppearanceScreen />, { wrapper });

    expect(screen.getByText("08:00", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("Votre médicament", { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");
    await renderAsNeededAppearance();

    expect(screen.getByRole("header", { name: "Appearance" })).toBeOnTheScreen();
    expect(screen.getByRole("radio", { name: "Round" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Other color" })).toBeOnTheScreen();
  });
});
