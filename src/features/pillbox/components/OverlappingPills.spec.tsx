import { render, screen } from "@testing-library/react-native";

import type { PillDesign } from "@/domain/med";

import { OverlappingPills } from "./OverlappingPills";

const DESIGN: PillDesign = {
  shape: "round",
  colors: ["#D6C9F5", "#D6C9F5"],
  size: "medium",
};
const LAYOUT = { pillSlotCount: 4, hasHiddenCountSlot: true };

describe("OverlappingPills", () => {
  it.each([1, 2, 4])("shows %i pills without hidden count", async (quantity) => {
    await render(<OverlappingPills design={DESIGN} quantity={quantity} layout={LAYOUT} />);

    expect(screen.getAllByTestId("overlapping-pill")).toHaveLength(quantity);
    expect(screen.queryByText(/^\+/)).not.toBeOnTheScreen();
  });

  it("shows 4 pills and the hidden count above 4", async () => {
    await render(<OverlappingPills design={DESIGN} quantity={6} layout={LAYOUT} />);

    expect(screen.getAllByTestId("overlapping-pill")).toHaveLength(4);
    expect(screen.getByText("+2")).toBeOnTheScreen();
  });
});
