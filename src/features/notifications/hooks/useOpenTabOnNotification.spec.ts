import { renderHook } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

import { useTabResetStore } from "@/shared/navigation/tabResetStore";

import { useOpenTabOnNotification } from "./useOpenTabOnNotification";

jest.mock("expo-notifications", () => ({ addNotificationResponseReceivedListener: jest.fn() }));
jest.mock("expo-router", () => ({ router: { navigate: jest.fn() } }));

async function tapNotification(identifier: string) {
  let listener: ((response: Notifications.NotificationResponse) => void) | undefined;
  jest
    .mocked(Notifications.addNotificationResponseReceivedListener)
    .mockImplementation((callback) => {
      listener = callback;
      return { remove: jest.fn() };
    });
  await renderHook(() => useOpenTabOnNotification());
  listener?.({
    notification: { request: { identifier } },
  } as Notifications.NotificationResponse);
}

describe("useOpenTabOnNotification", () => {
  beforeEach(() => {
    useTabResetStore.setState({ requestCounts: { today: 0, meds: 0 } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("opens the today tab from an intake reminder", async () => {
    await tapNotification("reminder-intake-1-2026-11-08T09:00");

    expect(router.navigate).toHaveBeenCalledWith("/today");
    expect(useTabResetStore.getState().requestCounts).toEqual({ today: 1, meds: 0 });
  });

  it("opens the meds tab from a low stock alert", async () => {
    await tapNotification("low-stock-2026-11-21");

    expect(router.navigate).toHaveBeenCalledWith("/meds");
    expect(useTabResetStore.getState().requestCounts).toEqual({ today: 0, meds: 1 });
  });
});
