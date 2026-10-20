import { useNavigation } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useEffect, useState } from "react";

type PreventedAction = Parameters<Parameters<typeof usePreventRemove>[1]>[0]["data"]["action"];

export function useModalClosing(hasUnsavedChanges: boolean) {
  const navigation = useNavigation();
  const [preventedAction, setPreventedAction] = useState<PreventedAction | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  usePreventRemove(hasUnsavedChanges && !isClosing, ({ data }) => {
    setPreventedAction(data.action);
  });

  useEffect(() => {
    navigation.getParent()?.setOptions({ gestureEnabled: !hasUnsavedChanges });
  }, [navigation, hasUnsavedChanges]);

  useEffect(() => {
    if (isClosing) {
      navigation.getParent()?.goBack();
    }
  }, [navigation, isClosing]);

  return {
    requestClose: () => navigation.getParent()?.goBack(),
    close: () => setIsClosing(true),
    isDiscardDialogVisible: preventedAction !== null,
    confirmDiscard: () => {
      if (preventedAction !== null) {
        setPreventedAction(null);
        navigation.dispatch(preventedAction);
      }
    },
    cancelDiscard: () => setPreventedAction(null),
  };
}
