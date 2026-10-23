import { fireEvent, render, screen } from "@testing-library/react-native";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";

import { NotificationsRow } from "./NotificationsRow";

jest.mock("@/features/notifications/hooks/useNotificationPermission", () => ({
  useNotificationPermission: jest.fn(),
}));

describe("NotificationsRow", () => {
  const request = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows that the notifications are allowed, without button", async () => {
    jest.mocked(useNotificationPermission).mockReturnValue({ isGranted: true, request });

    await render(<NotificationsRow />);

    expect(screen.getByLabelText("Notifications : autorisées")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).not.toBeOnTheScreen();
  });

  it("asks for the permission when not allowed", async () => {
    jest.mocked(useNotificationPermission).mockReturnValue({ isGranted: false, request });
    await render(<NotificationsRow />);

    await fireEvent.press(screen.getByRole("button", { name: "Notifications : activer" }));

    expect(request).toHaveBeenCalledTimes(1);
  });

  it("shows no value while the permission is unknown", async () => {
    jest.mocked(useNotificationPermission).mockReturnValue({ isGranted: null, request });

    await render(<NotificationsRow />);

    expect(screen.getByLabelText("Notifications")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).not.toBeOnTheScreen();
    expect(screen.queryByText("Autorisées")).not.toBeOnTheScreen();
  });
});
