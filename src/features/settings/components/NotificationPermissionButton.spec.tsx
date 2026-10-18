import { fireEvent, render, screen } from "@testing-library/react-native";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";

import { NotificationPermissionButton } from "./NotificationPermissionButton";

jest.mock("@/features/notifications/hooks/useNotificationPermission", () => ({
  useNotificationPermission: jest.fn(),
}));

describe("NotificationPermissionButton", () => {
  const request = jest.fn();

  it("asks for the permission when pressed", async () => {
    jest.mocked(useNotificationPermission).mockReturnValue({ isGranted: false, request });
    await render(<NotificationPermissionButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Accepter les notifications" }));

    expect(request).toHaveBeenCalledTimes(1);
  });

  it.each([true, null])("is hidden when the permission is %s", async (isGranted) => {
    jest.mocked(useNotificationPermission).mockReturnValue({ isGranted, request });

    await render(<NotificationPermissionButton />);

    expect(
      screen.queryByRole("button", { name: "Accepter les notifications" }),
    ).not.toBeOnTheScreen();
  });
});
