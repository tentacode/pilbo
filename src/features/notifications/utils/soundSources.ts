import beep from "@/assets/sounds/beep.wav";
import beepShort from "@/assets/sounds/beep_short.wav";
import chime from "@/assets/sounds/chime.wav";
import drop from "@/assets/sounds/drop.wav";
import gentleAlertResolved from "@/assets/sounds/gentle_alert_resolved.wav";
import nocturne from "@/assets/sounds/nocturne.wav";
import pillRattle from "@/assets/sounds/pill_rattle.wav";
import shire from "@/assets/sounds/shire.wav";

import type { NotificationSound } from "@/domain/sound";

export const SOUND_SOURCES: Record<Exclude<NotificationSound, "vibration">, number> = {
  beep_short: beepShort,
  beep,
  chime,
  drop,
  pill_rattle: pillRattle,
  gentle_alert_resolved: gentleAlertResolved,
  nocturne,
  shire,
};
