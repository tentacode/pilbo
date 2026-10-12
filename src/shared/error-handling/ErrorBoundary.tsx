import type { ErrorBoundaryProps } from "expo-router";

import { ErrorScreen } from "./ErrorScreen";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  return <ErrorScreen details={error.message} />;
}
