import { formatIntakeTime, type Intake } from "@/domain/intake";
import { formatMedLabel } from "@/domain/med";

export function formatReminderTitle(intake: Intake): string {
  return `C'est l'heure de votre prise de ${formatIntakeTime(intake.time)}`;
}

export function formatReminderBody(intake: Intake): string {
  return intake.medQuantities
    .map(({ med, quantity }) => `${quantity} × ${formatMedLabel(med)}`)
    .join(", ");
}
