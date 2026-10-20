import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import type { MedDraft } from "@/features/pillbox/utils/medDraft";

type MedDraftContextValue = {
  draft: MedDraft | null;
  setDraft: Dispatch<SetStateAction<MedDraft | null>>;
};

const MedDraftContext = createContext<MedDraftContextValue | null>(null);

type MedDraftProviderProps = {
  initialDraft?: MedDraft;
  children: ReactNode;
};

export function MedDraftProvider({ initialDraft, children }: MedDraftProviderProps) {
  const [draft, setDraft] = useState<MedDraft | null>(initialDraft ?? null);
  return (
    <MedDraftContext.Provider value={{ draft, setDraft }}>{children}</MedDraftContext.Provider>
  );
}

export function useMedDraftContext(): MedDraftContextValue {
  const value = useContext(MedDraftContext);
  if (value === null) {
    throw new Error("useMedDraftContext must be used inside a MedDraftProvider");
  }
  return value;
}

export function useMedDraft(createInitialDraft: () => MedDraft) {
  const { draft, setDraft } = useMedDraftContext();
  const [initialDraft] = useState(createInitialDraft);

  useEffect(() => {
    setDraft(initialDraft);
    return () => setDraft(null);
  }, [initialDraft, setDraft]);

  return {
    draft: draft ?? initialDraft,
    update: (changes: Partial<MedDraft>) =>
      setDraft((current) => ({ ...(current ?? initialDraft), ...changes })),
  };
}
