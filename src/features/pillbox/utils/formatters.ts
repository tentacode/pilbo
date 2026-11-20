import type { TFunction } from "i18next";

import { type Intake, isEveryDay, type Weekday } from "@/domain/intake";
import { pillSwatches, type PillSwatch } from "@/design-system/tokens";
import { formatMedLabel, type PillDesign, type PillShape, type PillSize } from "@/domain/med";
import { capitalize, formatIntakeTime, formatWeekday } from "@/shared/i18n/formatters";
import type { Language } from "@/shared/i18n/resources";

import { formatRecurrence } from "./recurrenceFormatters";

export function formatIntakeSchedule(
  t: TFunction<"pillbox">,
  language: Language,
  intake: Intake,
): string {
  if (!isEveryDay(intake)) {
    return formatRecurrence(t, language, intake);
  }
  return t("{{days}} · rappel toutes les {{minutes}} min", {
    days: t("Tous les jours"),
    minutes: intake.reminderIntervalMinutes,
  });
}

export function formatQuantityAccessibilityLabel(
  t: TFunction<"pillbox">,
  medLabel: string,
  quantity: number,
): string {
  return t("{{med}}, quantité {{quantity}}", { med: medLabel, quantity });
}

export function formatIntakeAccessibilityLabel(
  t: TFunction<"pillbox">,
  language: Language,
  intake: Intake,
  nextIntake: string | null,
): string {
  const schedule =
    nextIntake === null
      ? t("{{days}}, rappel toutes les {{minutes}} minutes", {
          days: t("Tous les jours"),
          minutes: intake.reminderIntervalMinutes,
        })
      : `${formatRecurrence(t, language, intake)}. ${nextIntake}`;
  const meds = intake.medQuantities
    .map(({ med, quantity }) => formatQuantityAccessibilityLabel(t, formatMedLabel(med), quantity))
    .join(". ");
  return `${formatIntakeTime(intake.time)}. ${schedule}. ${meds}`;
}

export function formatDayInitials(day: Weekday, language: Language): string {
  return capitalize(formatWeekday(day, language, "long").slice(0, 2));
}

export function formatDayName(day: Weekday, language: Language): string {
  return capitalize(formatWeekday(day, language, "long"));
}

function shapeNamesOf(t: TFunction<"pillbox">): Record<PillShape, string> {
  return {
    round: t("rond"),
    oval: t("ovale"),
    capsule: t("gélule"),
    softgel: t("capsule molle"),
    triangle: t("triangle"),
    square: t("carré"),
    sachet: t("sachet"),
    tube: t("tube"),
    syrup: t("sirop"),
    drops: t("gouttes"),
  };
}

function sizeNamesOf(t: TFunction<"pillbox">): Record<PillSize, string> {
  return {
    small: t("petite"),
    medium: t("moyenne"),
    large: t("grande"),
  };
}

function swatchNamesOf(t: TFunction<"pillbox">): Record<PillSwatch, string> {
  return {
    white: t("blanc"),
    yellow: t("jaune"),
    pink: t("rose"),
    lilac: t("lilas"),
    skyBlue: t("bleu ciel"),
    mint: t("menthe"),
  };
}

export function formatColorName(t: TFunction<"pillbox">, color: string): string {
  const swatch = findSwatch(color);
  return swatch === undefined ? t("couleur personnalisée") : swatchNamesOf(t)[swatch];
}

function formatColors(t: TFunction<"pillbox">, colors: PillDesign["colors"]): string {
  const [first, second] = colors.map((color) => formatColorName(t, color));
  return first === second ? first : t("{{first}} et {{second}}", { first, second });
}

export function formatPillDescriptionParts(t: TFunction<"pillbox">, design: PillDesign): string[] {
  return [
    shapeNamesOf(t)[design.shape],
    sizeNamesOf(t)[design.size],
    formatColors(t, design.colors),
  ];
}

export function formatPreviewLabel(t: TFunction<"pillbox">, design: PillDesign): string {
  return t("Aperçu : {{description}}", {
    description: formatPillDescriptionParts(t, design).join(", "),
  });
}

export function formatPillDescription(t: TFunction<"pillbox">, design: PillDesign): string {
  return capitalize(formatPillDescriptionParts(t, design).join(" · "));
}

export function formatShapeName(t: TFunction<"pillbox">, shape: PillShape): string {
  return capitalize(shapeNamesOf(t)[shape]);
}

export function formatSizeName(t: TFunction<"pillbox">, size: PillSize): string {
  return capitalize(sizeNamesOf(t)[size]);
}

export function formatColorTitle(t: TFunction<"pillbox">, color: string): string {
  return capitalize(formatColorName(t, color));
}

export function findSwatch(color: string): PillSwatch | undefined {
  return (Object.keys(pillSwatches) as PillSwatch[]).find(
    (swatch) => pillSwatches[swatch].toLowerCase() === color.toLowerCase(),
  );
}
