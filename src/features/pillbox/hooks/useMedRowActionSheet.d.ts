export type MedRowActions = {
  medLabel: string;
  onEditMed: () => void;
  onRemove: () => void;
};

export declare function useMedRowActionSheet(): (actions: MedRowActions) => void;
