import { renderHook } from "@testing-library/react-native";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Vibration } from "react-native";

import { useSoundPreview } from "./useSoundPreview";

const mockPlayer = { replace: jest.fn(), play: jest.fn(), pause: jest.fn(), remove: jest.fn() };

jest.mock("expo-audio", () => ({
  createAudioPlayer: jest.fn(() => mockPlayer),
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/features/notifications/utils/soundSources", () => ({
  SOUND_SOURCES: { beep: 1, chime: 2 },
}));

describe("useSoundPreview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Vibration, "vibrate").mockImplementation(() => {});
  });

  it("plays in silent mode and lowers the other audio", async () => {
    await renderHook(() => useSoundPreview());

    expect(setAudioModeAsync).toHaveBeenCalledWith({
      playsInSilentMode: true,
      interruptionMode: "duckOthers",
    });
  });

  it("replaces the playing sound without pausing, which would silence the next one", async () => {
    const { result } = await renderHook(() => useSoundPreview());

    result.current.play("beep");
    result.current.play("chime");

    expect(createAudioPlayer).toHaveBeenCalledTimes(1);
    expect(mockPlayer.pause).not.toHaveBeenCalled();
    expect(mockPlayer.replace).toHaveBeenLastCalledWith(2);
    expect(mockPlayer.play).toHaveBeenCalledTimes(2);
  });

  it("vibrates for the vibration only, stopping the sound", async () => {
    const { result } = await renderHook(() => useSoundPreview());

    result.current.play("beep");
    result.current.play("vibration");

    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
    expect(mockPlayer.pause).toHaveBeenCalledTimes(1);
    expect(mockPlayer.play).toHaveBeenCalledTimes(1);
  });

  it("releases the player when the screen is left", async () => {
    const { result, unmount } = await renderHook(() => useSoundPreview());
    result.current.play("beep");

    await unmount();

    expect(mockPlayer.remove).toHaveBeenCalledTimes(1);
  });
});
