import {
  isNotificationSound,
  NOTIFICATION_SOUNDS,
  soundFileOf,
  toNotificationSound,
} from "./sound";

describe("soundFileOf", () => {
  it("names the file after the sound", () => {
    expect(soundFileOf("chime")).toBe("chime.wav");
    expect(soundFileOf("gentle_alert_resolved")).toBe("gentle_alert_resolved.wav");
  });

  it("uses a silent file for the vibration only", () => {
    expect(soundFileOf("vibration")).toBe("silence.wav");
  });
});

describe("isNotificationSound", () => {
  it("accepts every known sound", () => {
    expect(NOTIFICATION_SOUNDS.every(isNotificationSound)).toBe(true);
  });

  it.each(["gentle_alert", "silence", "", null, 3])("rejects %p", (value) => {
    expect(isNotificationSound(value)).toBe(false);
  });
});

describe("toNotificationSound", () => {
  it("keeps a known sound", () => {
    expect(toNotificationSound("nocturne")).toBe("nocturne");
  });

  it("falls back to the default sound", () => {
    expect(toNotificationSound("gentle_alert")).toBe("beep");
  });
});
