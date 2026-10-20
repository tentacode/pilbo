import {
  formatColorName,
  formatColorTitle,
  formatDayInitials,
  formatDayName,
  formatPillDescription,
  formatShapeName,
  formatSizeName,
} from "./formatters";

describe("formatDayInitials", () => {
  it("returns the two letters of the day", () => {
    expect(formatDayInitials("monday")).toBe("Lu");
    expect(formatDayInitials("sunday")).toBe("Di");
  });
});

describe("formatDayName", () => {
  it("returns the capitalized day name", () => {
    expect(formatDayName("wednesday")).toBe("Mercredi");
  });
});

describe("formatColorName", () => {
  it("names a swatch color, ignoring the case", () => {
    expect(formatColorName("#d6c9f5")).toBe("lilas");
  });

  it("names any other color as a custom color", () => {
    expect(formatColorName("#F58FB8")).toBe("couleur personnalisée");
  });
});

describe("formatPillDescription", () => {
  it("describes the shape, the size and the colors", () => {
    expect(
      formatPillDescription({ shape: "capsule", size: "medium", colors: ["#FBE29A", "#FFFFFF"] }),
    ).toBe("Gélule · moyenne · jaune et blanc");
  });

  it("names a color once when both halves are the same", () => {
    expect(
      formatPillDescription({ shape: "capsule", size: "small", colors: ["#B3E8E0", "#B3E8E0"] }),
    ).toBe("Gélule · petite · menthe");
  });

  it("describes a single color shape", () => {
    expect(
      formatPillDescription({ shape: "softgel", size: "large", colors: ["#F8C6DA", "#F8C6DA"] }),
    ).toBe("Capsule molle · grande · rose");
  });
});

describe("formatShapeName", () => {
  it("returns the capitalized shape name", () => {
    expect(formatShapeName("softgel")).toBe("Capsule molle");
  });
});

describe("formatSizeName", () => {
  it("returns the capitalized size name", () => {
    expect(formatSizeName("small")).toBe("Petite");
  });
});

describe("formatColorTitle", () => {
  it("returns the capitalized color name", () => {
    expect(formatColorTitle("#C4DDF7")).toBe("Bleu ciel");
    expect(formatColorTitle("#123456")).toBe("Couleur personnalisée");
  });
});
