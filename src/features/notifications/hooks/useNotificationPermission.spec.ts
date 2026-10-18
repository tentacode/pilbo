import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AppState, type AppStateStatus, Linking } from "react-native";

import {
  getPermissionStatus,
  type PermissionStatus,
  requestPermission,
} from "@/features/notifications/notifications";
import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";

import { useNotificationPermission } from "./useNotificationPermission";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/features/notifications/notifications", () => ({
  getPermissionStatus: jest.fn(),
  requestPermission: jest.fn(),
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return { useFocusEffect: (effect: () => void) => useEffect(effect, [effect]) };
});

describe("useNotificationPermission", () => {
  let permissionStatus: PermissionStatus;
  let appStateListener: ((state: AppStateStatus) => void) | undefined;

  beforeEach(() => {
    jest.mocked(getPermissionStatus).mockImplementation(() => Promise.resolve(permissionStatus));
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, listener) => {
      appStateListener = listener;
      return { remove: jest.fn() };
    });
    jest.spyOn(Linking, "openSettings").mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("reads the permission status", async () => {
    permissionStatus = "granted";

    const { result } = await renderHook(() => useNotificationPermission());

    await waitFor(() => expect(result.current.isGranted).toBe(true));
  });

  it("shows the system popup when the permission was never asked", async () => {
    permissionStatus = "undetermined";
    jest.mocked(requestPermission).mockImplementation(() => {
      permissionStatus = "granted";
      return Promise.resolve(true);
    });
    const { result } = await renderHook(() => useNotificationPermission());
    await waitFor(() => expect(result.current.isGranted).toBe(false));

    await act(() => result.current.request());

    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
    expect(result.current.isGranted).toBe(true);
  });

  it("stays not granted when the system popup is refused", async () => {
    permissionStatus = "undetermined";
    jest.mocked(requestPermission).mockImplementation(() => {
      permissionStatus = "denied";
      return Promise.resolve(false);
    });
    const { result } = await renderHook(() => useNotificationPermission());

    await act(() => result.current.request());

    expect(rescheduleReminders).not.toHaveBeenCalled();
    expect(result.current.isGranted).toBe(false);
  });

  it("opens the settings when the permission was denied", async () => {
    permissionStatus = "denied";
    const { result } = await renderHook(() => useNotificationPermission());

    await act(() => result.current.request());

    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("does nothing when the permission is already granted", async () => {
    permissionStatus = "granted";
    const { result } = await renderHook(() => useNotificationPermission());

    await act(() => result.current.request());

    expect(Linking.openSettings).not.toHaveBeenCalled();
    expect(requestPermission).not.toHaveBeenCalled();
    expect(result.current.isGranted).toBe(true);
  });

  it("reads the permission again when the app comes back to the foreground", async () => {
    permissionStatus = "denied";
    const { result } = await renderHook(() => useNotificationPermission());
    await waitFor(() => expect(result.current.isGranted).toBe(false));

    permissionStatus = "granted";
    await act(async () => appStateListener?.("active"));

    await waitFor(() => expect(result.current.isGranted).toBe(true));
  });
});
