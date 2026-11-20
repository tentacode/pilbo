import { createContext, type ReactNode, useContext, useState } from "react";

import type { Intake, IntakeFrequency, Weekday } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { NotificationSound } from "@/domain/sound";
import { database } from "@/shared/database/database";

import { getIntakeById } from "@/features/pillbox/queries/getIntakeById";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import {
  addDraftMed,
  createIntakeDraft,
  type DayMode,
  draftSignature,
  type IntakeDraft,
  replaceDraftMed,
  toggleDay as toggleDayOf,
  withDayMode,
  withFrequency,
} from "@/features/pillbox/utils/intakeDraft";
import { MINIMUM_MED_QUANTITY } from "@/features/pillbox/utils/validators";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

type IntakeDraftContextValue = {
  draft: IntakeDraft;
  initialDraft: IntakeDraft;
  isDirty: boolean;
  isHandledToday: boolean;
  setTime: (time: Intake["time"]) => void;
  setDayMode: (dayMode: DayMode) => void;
  setFrequency: (frequency: IntakeFrequency) => void;
  setInterval: (interval: number) => void;
  setStartsOn: (startsOn: string) => void;
  toggleDay: (day: Weekday) => void;
  setReminderInterval: (minutes: number) => void;
  setSound: (sound: NotificationSound) => void;
  addMed: (med: Med, quantity?: number) => void;
  updateMed: (med: Med) => void;
  setQuantity: (medId: string, quantity: number) => void;
  removeMed: (medId: string) => void;
};

const IntakeDraftContext = createContext<IntakeDraftContextValue | null>(null);

type IntakeDraftProviderProps = {
  intakeId?: string;
  children: ReactNode;
};

export function IntakeDraftProvider({ intakeId, children }: IntakeDraftProviderProps) {
  const defaultReminderIntervalMinutes = useSettingsStore(
    (state) => state.defaultReminderIntervalMinutes,
  );
  const defaultReminderSound = useSettingsStore((state) => state.defaultReminderSound);
  const [initialDraft] = useState(() =>
    createIntakeDraft(
      defaultReminderIntervalMinutes,
      defaultReminderSound,
      toLocalDate(new Date()),
      intakeId === undefined ? undefined : getIntakeById(database, intakeId),
    ),
  );
  const [draft, setDraft] = useState(initialDraft);
  const [isHandledToday] = useState(
    () =>
      intakeId !== undefined &&
      getIntakeLogsOfDay(database, toLocalDate(new Date())).some(
        (intakeLog) => intakeLog.intakeId === intakeId,
      ),
  );

  function updateDraft(changes: (current: IntakeDraft) => Partial<IntakeDraft>) {
    setDraft((current) => ({ ...current, ...changes(current) }));
  }

  const value: IntakeDraftContextValue = {
    draft,
    initialDraft,
    isDirty: draftSignature(draft) !== draftSignature(initialDraft),
    isHandledToday,
    setTime: (time) => updateDraft(() => ({ time })),
    setDayMode: (dayMode) =>
      updateDraft((current) =>
        withDayMode(current, dayMode, initialDraft.startsOn, toLocalDate(new Date())),
      ),
    setFrequency: (frequency) =>
      updateDraft((current) =>
        withFrequency(current, frequency, initialDraft.startsOn, toLocalDate(new Date())),
      ),
    setInterval: (interval) => updateDraft(() => ({ interval })),
    setStartsOn: (startsOn) => updateDraft(() => ({ startsOn })),
    toggleDay: (day) => updateDraft((current) => ({ days: toggleDayOf(current.days, day) })),
    setReminderInterval: (reminderIntervalMinutes) =>
      updateDraft(() => ({ reminderIntervalMinutes })),
    setSound: (sound) => updateDraft(() => ({ sound })),
    addMed: (med, quantity = MINIMUM_MED_QUANTITY) =>
      updateDraft((current) => ({
        medQuantities: addDraftMed(current.medQuantities, med, quantity),
      })),
    updateMed: (med) =>
      updateDraft((current) => ({ medQuantities: replaceDraftMed(current.medQuantities, med) })),
    setQuantity: (medId, quantity) =>
      updateDraft((current) => ({
        medQuantities: current.medQuantities.map((medQuantity) =>
          medQuantity.med.id === medId ? { ...medQuantity, quantity } : medQuantity,
        ),
      })),
    removeMed: (medId) =>
      updateDraft((current) => ({
        medQuantities: current.medQuantities.filter(({ med }) => med.id !== medId),
      })),
  };

  return <IntakeDraftContext.Provider value={value}>{children}</IntakeDraftContext.Provider>;
}

export function useIntakeDraft(): IntakeDraftContextValue {
  const value = useContext(IntakeDraftContext);
  if (value === null) {
    throw new Error("useIntakeDraft must be used inside an IntakeDraftProvider");
  }
  return value;
}
