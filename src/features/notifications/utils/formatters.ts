import { formatIntakeTime, type Intake } from "@/domain/intake";

export function formatReminderTitle(intake: Intake): string {
  return `C'est l'heure de votre prise de ${formatIntakeTime(intake.time)}`;
}

export function formatReminderBody(intake: Intake): string {
  return intake.medQuantities
    .map(({ med, quantity }) => `${quantity} × ${med.name} ${med.strength}`)
    .join(", ");
}
