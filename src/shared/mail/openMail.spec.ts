import { Linking } from "react-native";

import { buildMailUrl, openMail } from "./openMail";

describe("buildMailUrl", () => {
  it("targets the support address with an encoded subject and an empty body", () => {
    expect(buildMailUrl("Pilbo : j'ai une idée")).toBe(
      "mailto:pilbo@tentacode.dev?subject=Pilbo%20%3A%20j'ai%20une%20id%C3%A9e&body=",
    );
  });

  it("encodes the body", () => {
    expect(buildMailUrl("Pilbo", "Line 1\nLine 2")).toBe(
      "mailto:pilbo@tentacode.dev?subject=Pilbo&body=Line%201%0ALine%202",
    );
  });
});

describe("openMail", () => {
  it("opens the mail URL", () => {
    jest.spyOn(Linking, "openURL").mockResolvedValue(true);

    openMail("Pilbo");

    expect(Linking.openURL).toHaveBeenCalledWith("mailto:pilbo@tentacode.dev?subject=Pilbo&body=");
  });
});
