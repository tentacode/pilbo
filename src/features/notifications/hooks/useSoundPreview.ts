import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useEffect, useRef } from "react";
import { Vibration } from "react-native";

import type { NotificationSound } from "@/domain/sound";

import { SOUND_SOURCES } from "@/features/notifications/utils/soundSources";

type AudioPlayer = ReturnType<typeof createAudioPlayer>;

export function useSoundPreview(): { play: (sound: NotificationSound) => void } {
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "duckOthers" }).catch(
      (error: unknown) => console.error("Audio mode could not be set", error),
    );
    return () => {
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, []);

  function play(sound: NotificationSound) {
    if (sound === "vibration") {
      playerRef.current?.pause();
      Vibration.vibrate();
      return;
    }
    // replace() stops the current sound itself. pause() would deactivate the audio session while
    // the next sound is still loading, which silences it.
    const player = playerRef.current ?? createAudioPlayer();
    playerRef.current = player;
    player.replace(SOUND_SOURCES[sound]);
    player.play();
  }

  return { play };
}
