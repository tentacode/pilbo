import { router } from "expo-router";

export function openIntakeLogEditing(intakeId: string, localDate: string): void {
  router.push({ pathname: "/intake-log", params: { intakeId, date: localDate } });
}
