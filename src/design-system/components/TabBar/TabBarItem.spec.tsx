import { render, screen } from "@testing-library/react-native";

import { TabBarItem } from "./TabBarItem";

describe("TabBarItem", () => {
  it("is exposed as a labelled tab without badge", async () => {
    await render(<TabBarItem label="Aujourd'hui" icon="today" selected onPress={jest.fn()} />);

    expect(screen.getByRole("tab", { name: "Aujourd'hui", selected: true })).toBeOnTheScreen();
  });

  it("hides the badge when the count is 0", async () => {
    await render(
      <TabBarItem
        label="Aujourd'hui"
        icon="today"
        selected={false}
        badgeCount={0}
        badgeAccessibilityLabel="0 prise à valider"
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "Aujourd'hui" })).toBeOnTheScreen();
    expect(screen.queryByText("0")).not.toBeOnTheScreen();
  });

  it("shows the badge count described in the tab label", async () => {
    await render(
      <TabBarItem
        label="Aujourd'hui"
        icon="today"
        selected={false}
        badgeCount={2}
        badgeAccessibilityLabel="2 prises à valider"
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "Aujourd'hui, 2 prises à valider" })).toBeOnTheScreen();
    expect(screen.getByText("2")).toBeOnTheScreen();
  });
});
