# 34 — Prise « oubliée » (Pas pris… → Ignoré / Oublié)

## Contexte

Aujourd'hui, une prise n'a que deux actions : « Je l'ai pris » et « Ignorer ». Si on a oublié un médicament (ex. pilulier resté à la maison), la prise reste « En retard » jusqu'au lendemain, et on ne peut pas dire « je ne l'ai pas pris, mais c'est un oubli ». Entrée correspondante dans `specs/TODO_vrac.md` : « Lien "pas pris" sur les prises en retard ».

Décisions validées :

- « Ignorer » devient **« Pas pris… »** sur **toutes** les cartes (en retard, prochaine, plus tard). Il ouvre un drawer avec un paragraphe d'explication, puis « Je l'ai ignoré » / « Je l'ai oublié ».
- Le calendrier garde son code couleur : vert = pris, jaune = pris en retard, rouge = non pris (oublié **ou** sans action), pointillé = ignoré.
- Un jour passe en **rouge dès qu'une prise manque** (oubliée ou passée sans action), même si les autres sont prises.
- Dans « Modifier une prise », un 4e segment : Prise / Ignorée / **Oubliée** / Supprimer.

Technique : nouveau statut de log `missed`. La colonne `intake_log.status` est un texte libre, donc **pas de migration SQL** (seulement le type TypeScript). Le statut reste simple à lire pour le futur widget.

## Étapes

1. [x] **Domaine** : `IntakeLogStatus = "taken" | "skipped" | "missed"` (`src/domain/intakeLog.ts`). Mettre à jour la section Schéma de `docs/database.md` (valeurs possibles de `status`).
2. [x] **Écran du jour** (`computeTodayIntakes.ts`) : un log `missed` produit le statut `missed` (déjà existant pour les jours passés). Dans `TodayIntakeSections.tsx`, afficher ces prises avec `MissedIntakeCard` (comme `PastDayContent.tsx`), toujours modifiables.
3. [x] **Drawer** : nouveau composant design-system `ActionSheet` (basé sur `Modal`, comme `Dialog` : fondu du `Modal` et glissement du panneau par shared value (`useSlideUp`, `ReduceMotion.System`), focus VoiceOver sur le titre via `useAccessibilityFocusOnMount`, bouton « Annuler », tap sur le fond pour fermer, boutons ≥ 44 pt, tokens du thème).
4. [x] **Actions de carte** (`IntakeCardActions.tsx`) : « Ignorer » → « Pas pris… » qui ouvre l'`ActionSheet` (« Vous ne l'avez pas pris ? » → « Je l'ai ignoré » / « Je l'ai oublié »). `onSkip` devient `onNotTaken(intakeId, status)`, puis on met à jour `LateIntakeCard`, `NextIntakeCard`, `TodayIntakeSections` et `TodayContent` (`validate(intakeId, "missed")`). Libellés d'accessibilité dans `formatters.ts`.
5. [x] **Annonce et libellés** : `formatValidationAnnouncement` gère `missed` (« Prise de {{time}} oubliée »). Le statut affiché reste « Non prise » (style alerte, déjà géré par `IntakeStatusLabel`).
6. [x] **Modifier une prise** : 4e segment « Oubliée » dans `IntakeLogStatusField.tsx`. `saveIntakeLogChange.ts` traite `missed` comme `skipped` (pas de mouvement de stock).
7. [x] **Calendrier** (`computeDayStatus.ts`) : nouvelle priorité. `missed` si au moins une prise considérée n'a pas de log ou a un log `missed`. Sinon pris en retard > pris > ignoré. Mettre à jour `specs/19_calendar.md` (section État d'un jour) et vérifier les libellés VoiceOver (`calendar/utils/formatters.ts`).
8. [x] **Données de test** (`seed.ts`) : un jour avec un log `missed` explicite.
9. [x] **i18n** : `make i18n-extract`, traductions EN (`today.json`, `calendar.json`).
10. [x] **Tests** : Jest pour `computeTodayIntakes`, `computeDayStatus` (nouvelle priorité), `saveIntakeLogChange`, `useIntakeValidation` (pas de baisse de stock pour `missed`), `ActionSheet`, cartes (« Pas pris… » → drawer → actions). `make tests` vert.
11. [x] **Vérification sur téléphone** (validé sur le simulateur iPhone 17e et le Galaxy S9 ; iPhone 12 mini à revoir faute de câble) : `make build-device` et `make android-build-device`, test manuel (iPhone 12 mini en grand texte : drawer et segmented control à 4 segments, VoiceOver/TalkBack, rappel bien annulé après « oublié »).
12. [x] Cocher l'entrée dans `specs/TODO_vrac.md`.

## Fichiers principaux

- `src/domain/intakeLog.ts`
- `src/design-system/components/ActionSheet/` (nouveau)
- `src/features/today/components/IntakeCardActions.tsx`, `TodayIntakeSections.tsx`, `TodayContent.tsx`, `IntakeLogStatusField.tsx`
- `src/features/today/utils/computeTodayIntakes.ts`, `formatters.ts`
- `src/features/today/queries/saveIntakeLogChange.ts`
- `src/features/calendar/utils/computeDayStatus.ts`
- `src/shared/database/seed.ts`, `docs/database.md`, `specs/19_calendar.md`

## Réutilisé

- `MissedIntakeCard` et le statut UI `missed` (déjà là pour les jours passés).
- `Dialog` comme modèle pour `ActionSheet` (Modal, réduction des animations, focus a11y).
- `rescheduleReminders` : tout log, quel que soit son statut, compte déjà comme traité, donc rien à changer pour les notifications.

## Vérification

- `make tests`.
- Sur iPhone et Galaxy S9 : marquer une prise « oubliée » avant l'heure, puis une en retard. Vérifier que la carte passe en « Non prise » et que le rappel ne sonne plus. Le jour doit apparaître en rouge dans le calendrier. Repasser la prise en « Prise » depuis l'écran de modification.
