import type { TFunction } from "i18next";

import { buildMailUrl, openMail } from "@/shared/mail/openMail";

function buildSupportMailContent(t: TFunction<"common">, details?: string) {
  const subject = t("Pilbo : problème rencontré");
  const body = details ? `\n\n---\n${t("Détail technique : {{details}}", { details })}` : "";
  return { subject, body };
}

export function buildSupportMailUrl(t: TFunction<"common">, details?: string) {
  const { subject, body } = buildSupportMailContent(t, details);
  return buildMailUrl(subject, body);
}

export function contactSupport(t: TFunction<"common">, details?: string) {
  const { subject, body } = buildSupportMailContent(t, details);
  openMail(subject, body);
}
