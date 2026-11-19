import type { PillDesign } from "@/domain/med";

import {
  colorCountOf,
  pillShapes,
  pillSizes,
  randomPillDesign,
  withColor,
  withShape,
  withSingleColor,
} from "./pillDesign";

describe("withShape", () => {
  it("keeps the size and both colors", () => {
    expect(
      withShape({ shape: "capsule", size: "small", colors: ["#F58FB8", "#FFFFFF"] }, "round"),
    ).toEqual({ shape: "round", size: "small", colors: ["#F58FB8", "#FFFFFF"] });
  });

  it("gives a white container to a single-colored syrup or drops", () => {
    const lilacPill: PillDesign = { shape: "round", size: "small", colors: ["#D6C9F5", "#D6C9F5"] };
    expect(withShape(lilacPill, "syrup").colors).toEqual(["#D6C9F5", "#FFFFFF"]);
    expect(withShape(lilacPill, "drops").colors).toEqual(["#D6C9F5", "#FFFFFF"]);
  });

  it("keeps both colors of a two-colored syrup", () => {
    expect(
      withShape({ shape: "round", size: "small", colors: ["#D6C9F5", "#FBE29A"] }, "syrup").colors,
    ).toEqual(["#D6C9F5", "#FBE29A"]);
  });

  it("keeps a single color for the other shapes", () => {
    expect(
      withShape({ shape: "round", size: "small", colors: ["#D6C9F5", "#D6C9F5"] }, "sachet").colors,
    ).toEqual(["#D6C9F5", "#D6C9F5"]);
  });
});

describe("pillShapes", () => {
  it("lists the shapes in the configuration order", () => {
    expect(pillShapes()).toEqual([
      "round",
      "oval",
      "capsule",
      "softgel",
      "triangle",
      "square",
      "sachet",
      "tube",
      "syrup",
      "drops",
    ]);
  });
});

describe("withColor", () => {
  it("replaces the color of the given half", () => {
    expect(withColor(["#D6C9F5", "#D6C9F5"], 0, "#FBE29A")).toEqual(["#FBE29A", "#D6C9F5"]);
    expect(withColor(["#D6C9F5", "#D6C9F5"], 1, "#FBE29A")).toEqual(["#D6C9F5", "#FBE29A"]);
  });

  it("colors both halves with a single color", () => {
    expect(withColor(["#D6C9F5", "#B3E8E0"], 0, "#FBE29A", 1)).toEqual(["#FBE29A", "#FBE29A"]);
    expect(withColor(["#D6C9F5", "#B3E8E0"], 1, "#FBE29A", 1)).toEqual(["#FBE29A", "#FBE29A"]);
  });
});

describe("colorCountOf", () => {
  it("counts one color when both halves are identical", () => {
    expect(colorCountOf({ shape: "round", size: "small", colors: ["#D6C9F5", "#d6c9f5"] })).toBe(1);
  });

  it("counts two colors when the halves differ", () => {
    expect(colorCountOf({ shape: "round", size: "small", colors: ["#D6C9F5", "#FFFFFF"] })).toBe(2);
  });
});

describe("withSingleColor", () => {
  it("applies the first color to both halves", () => {
    expect(
      withSingleColor({ shape: "capsule", size: "large", colors: ["#F58FB8", "#FFFFFF"] }),
    ).toEqual({ shape: "capsule", size: "large", colors: ["#F58FB8", "#F58FB8"] });
  });
});

describe("pillSizes", () => {
  it("lists the sizes from the smallest", () => {
    expect(pillSizes()).toEqual(["small", "medium", "large"]);
  });
});

describe("randomPillDesign", () => {
  const current: PillDesign = { shape: "round", size: "small", colors: ["#FFFFFF", "#FFFFFF"] };

  function sequence(...values: number[]): () => number {
    let index = 0;
    return () => values[index++];
  }

  it("picks a shape, a size and two swatch colors", () => {
    expect(randomPillDesign(current, sequence(0.2, 0.99, 0.2, 0.9))).toEqual({
      shape: "capsule",
      size: "large",
      colors: ["#FBE29A", "#B3E8E0"],
    });
  });

  it("draws again when the design is unchanged", () => {
    expect(randomPillDesign(current, sequence(0, 0, 0, 0, 0.5, 0, 0, 0))).toEqual({
      shape: "square",
      size: "small",
      colors: ["#FFFFFF", "#FFFFFF"],
    });
  });

  it("gives a white container to a random syrup or drops", () => {
    expect(randomPillDesign(current, sequence(0.99, 0, 0.2, 0.9))).toEqual({
      shape: "drops",
      size: "small",
      colors: ["#FBE29A", "#FFFFFF"],
    });
  });

  it("uses Math.random by default", () => {
    const design = randomPillDesign(current);

    expect(pillShapes()).toContain(design.shape);
    expect(design).not.toEqual(current);
  });
});
