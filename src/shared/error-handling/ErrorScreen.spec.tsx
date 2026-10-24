import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { i18n } from "@/shared/i18n/i18n";
import { renderInEnglish } from "@/shared/i18n/testHelpers";

import { ErrorScreen } from "./ErrorScreen";
import { buildSupportMailUrl } from "./utils/contactSupport";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("ErrorScreen", () => {
  it("shows the default texts", async () => {
    await render(<ErrorScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Oups, petit contretemps" })).toBeOnTheScreen();
    expect(screen.getByText(/Quelque chose ne s’est pas passé comme prévu/)).toBeOnTheScreen();
    expect(screen.getByText("Si le problème persiste, écrivez-nous.")).toBeOnTheScreen();
  });

  it("shows the overridden texts and the details", async () => {
    await render(
      <ErrorScreen title="Données indisponibles" message="Autre message" details="Disk full" />,
      { wrapper },
    );

    expect(screen.getByRole("header", { name: "Données indisponibles" })).toBeOnTheScreen();
    expect(screen.getByText("Autre message")).toBeOnTheScreen();
    expect(screen.getByText("Disk full")).toBeOnTheScreen();
  });

  it("opens a mail to the support with the details", async () => {
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    await render(<ErrorScreen details="Disk full" />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Contactez-nous" }));

    expect(openURL).toHaveBeenCalledWith(
      buildSupportMailUrl(i18n.getFixedT(null, "common"), "Disk full"),
    );
  });

  it("is translated in English", async () => {
    await renderInEnglish(<ErrorScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Oops, a small hiccup" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Contact us" })).toBeOnTheScreen();
  });
});
