import { render } from "@testing-library/react-native";
import type { ReactElement } from "react";

import { i18n } from "./i18n";

export async function renderInEnglish(
  element: ReactElement,
  options?: Parameters<typeof render>[1],
): ReturnType<typeof render> {
  await i18n.changeLanguage("en");
  return render(element, options);
}
