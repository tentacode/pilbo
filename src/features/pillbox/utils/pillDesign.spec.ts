import { pillShapes, withColor, withShape } from "./pillDesign";

describe("withShape", () => {
  it("keeps the size and both colors", () => {
    expect(
      withShape({ shape: "capsule", size: "small", colors: ["#F58FB8", "#FFFFFF"] }, "round"),
    ).toEqual({ shape: "round", size: "small", colors: ["#F58FB8", "#FFFFFF"] });
  });
});

describe("pillShapes", () => {
  it("lists the shapes in the configuration order", () => {
    expect(pillShapes()).toEqual(["round", "oval", "capsule", "softgel", "triangle", "square"]);
  });
});

describe("withColor", () => {
  it("replaces the color of the given half", () => {
    expect(withColor(["#D6C9F5", "#D6C9F5"], 0, "#FBE29A")).toEqual(["#FBE29A", "#D6C9F5"]);
    expect(withColor(["#D6C9F5", "#D6C9F5"], 1, "#FBE29A")).toEqual(["#D6C9F5", "#FBE29A"]);
  });
});
