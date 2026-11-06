import { useTranslation } from "react-i18next";

import { openMail } from "@/shared/mail/openMail";

import { SettingsRow } from "./SettingsRow";

type FeedbackRowProps = {
  label: string;
  mailSubject: string;
};

export function FeedbackRow({ label, mailSubject }: FeedbackRowProps) {
  const { t } = useTranslation("settings");
  return (
    <SettingsRow
      label={label}
      hasChevron
      onPress={() => openMail(mailSubject)}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint={t("Ouvre un e-mail à l’équipe Pilbo")}
    />
  );
}
