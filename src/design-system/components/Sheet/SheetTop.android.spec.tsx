import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SheetTop } from "./SheetTop";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 24, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("SheetTop (Android)", () => {
  it("leaves room for the status bar", async () => {
    await render(<SheetTop />, { wrapper });

    expect(screen.getByTestId("sheet-top-inset")).toHaveStyle({ height: 24 });
  });
});
