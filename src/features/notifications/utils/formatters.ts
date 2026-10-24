import type { Intake } from "@/domain/intake";
import { formatMedLabel, type Med } from "@/domain/med";
import { formatIntakeTime } from "@/shared/i18n/formatters";
import { i18n } from "@/shared/i18n/i18n";

export function formatReminderTitle(intake: Intake): string {
  return i18n.t("C'est l'heure de votre prise de {{time}}", {
    ns: "notifications",
    time: formatIntakeTime(intake.time),
  });
}

export function formatReminderBody(intake: Intake): string {
  return intake.medQuantities
    .map(({ med, quantity }) => `${quantity} × ${formatMedLabel(med)}`)
    .join(", ");
}

export function formatLowStockAlertTitle(): string {
  return i18n.t("Stock bas", { ns: "notifications" });
}

export function formatLowStockAlertBody(meds: Pick<Med, "name" | "strength">[]): string {
  return i18n.t("{{meds}} : pensez à les renouveler.", {
    ns: "notifications",
    count: meds.length,
    meds: meds.map(formatMedLabel).join(", "),
  });
}
