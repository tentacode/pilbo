import { createContext, type ReactNode, useContext, useState } from "react";

import type { Intake, Weekday } from "@/domain/intake";
import type { Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { getIntakeById } from "@/features/pillbox/queries/getIntakeById";
import {
  createIntakeDraft,
  type DayMode,
  draftSignature,
  type IntakeDraft,
  replaceDraftMed,
  selectedDaysOf,
  toggleDay as toggleDayOf,
} from "@/features/pillbox/utils/intakeDraft";
import { MINIMUM_MED_QUANTITY } from "@/features/pillbox/utils/validators";

type IntakeDraftContextValue = {
  draft: IntakeDraft;
  initialDraft: IntakeDraft;
  isDirty: boolean;
  setTime: (time: Intake["time"]) => void;
  setDayMode: (dayMode: DayMode) => void;
  toggleDay: (day: Weekday) => void;
  setReminderInterval: (minutes: number) => void;
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
  const [initialDraft] = useState(() =>
    createIntakeDraft(intakeId === undefined ? undefined : getIntakeById(database, intakeId)),
  );
  const [draft, setDraft] = useState(initialDraft);

  function updateDraft(changes: (current: IntakeDraft) => Partial<IntakeDraft>) {
    setDraft((current) => ({ ...current, ...changes(current) }));
  }

  const value: IntakeDraftContextValue = {
    draft,
    initialDraft,
    isDirty: draftSignature(draft) !== draftSignature(initialDraft),
    setTime: (time) => updateDraft(() => ({ time })),
    setDayMode: (dayMode) => updateDraft(() => ({ dayMode })),
    toggleDay: (day) =>
      updateDraft((current) => ({
        dayMode: "someDays",
        days: toggleDayOf(selectedDaysOf(current), day),
      })),
    setReminderInterval: (reminderIntervalMinutes) =>
      updateDraft(() => ({ reminderIntervalMinutes })),
    addMed: (med, quantity = MINIMUM_MED_QUANTITY) =>
      updateDraft((current) => ({ medQuantities: [...current.medQuantities, { med, quantity }] })),
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
