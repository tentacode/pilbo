import {
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_600SemiBold,
  AtkinsonHyperlegibleNext_700Bold,
} from "@expo-google-fonts/atkinson-hyperlegible-next";
import { YoungSerif_400Regular } from "@expo-google-fonts/young-serif";
import { useFonts } from "expo-font";

import { fontFamily } from "./tokens";

export function useDesignSystemFonts(): boolean {
  const [loaded, error] = useFonts({
    [fontFamily.regular]: AtkinsonHyperlegibleNext_400Regular,
    [fontFamily.semiBold]: AtkinsonHyperlegibleNext_600SemiBold,
    [fontFamily.bold]: AtkinsonHyperlegibleNext_700Bold,
    [fontFamily.display]: YoungSerif_400Regular,
  });
  return loaded || error !== null;
}
