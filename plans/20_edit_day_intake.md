# Spec 20 — Modifier une prise d'une journée

## Contexte

Corriger une prise après coup (oubli de valider, mauvaise heure, retard à rectifier). Spec : item « modifier une prise d'un jour » de `specs/TODO_vrac.md`.

- **Aujourd'hui** : seules les prises validées (« Déjà prise » : prises ou ignorées) sont modifiables. Les boutons « Prendre / Ignorer » restent tels quels.
- **Jours passés** : toutes les prises (prise, ignorée, non prise), toujours sans boutons « Prendre / Ignorer ».
- Écran dédié : modale `Sheet`, comme l'édition d'une prise du pilulier.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md` (requêtes, transactions, versions des prises).
- Code existant :
  - Aujourd'hui : `src/features/today/components/EarlierIntakeCard.tsx`, `MissedIntakeCard.tsx`, `TodayIntakeSections.tsx`, `PastDayContent.tsx`, `TodayMedList.tsx`, `hooks/useIntakeValidation.ts`, `hooks/useDayData.ts`, `queries/getIntakesOfDay.ts`, `getIntakeLogsOfDay.ts`, `insertIntakeLog.ts`, `utils/computeTodayIntakes.ts` (`toValidation`).
  - Stock : `src/features/stocks/queries/decreaseStocks.ts`, `increaseStock.ts`.
  - Modale : `src/features/pillbox/IntakeEditScreen.tsx`, `components/IntakeTimeRow.tsx`, `components/DiscardChangesDialog.tsx`, `hooks/useModalClosing.ts`, `hooks/useIntakeActions.ts` (`rescheduleAfterChange`).
  - Routes : `src/app/_layout.tsx`, `src/app/stock/`.
  - Design system : `Sheet`, `SegmentedControl`, `Button`, `Icon` (`chevronRight`).

## Comportement

Toucher une carte modifiable → modale « Prise de 08:00 » (sous-titre : la date) :

1. **Médicaments** de la prise, en lecture seule (pilule, nom, quantité), avec `TodayMedList`.
2. **Statut** (`SegmentedControl`) : « Prise » / « Ignorée » / « Supprimer ».
3. **Heure de prise** (seulement si « Prise ») : `DatePicker` heure/minute.
   - Défaut : heure déjà enregistrée si la prise était « prise », sinon l'heure prévue.
   - Le retard se recalcule tout seul (`toValidation`, seuil 60 min).
4. Pied : « Enregistrer ». Gauche : « Annuler » + dialogue « modifications non enregistrées ».

Enregistrement (une transaction) :

| Avant → après          | Log                                                 | Stock              |
| ---------------------- | --------------------------------------------------- | ------------------ |
| aucun → prise/ignorée  | insert (`expected_intake_at` = jour + heure prévue) | prise : −quantités |
| prise ↔ ignorée        | update `status` + `created_at`                      | +/− quantités      |
| prise → prise (heure)  | update `created_at`                                 | —                  |
| prise/ignorée → aucune | delete                                              | prise : +quantités |

- `created_at` : prise → jour + heure choisie ; ignorée → `created_at` précédent, sinon heure prévue.
- Puis : replanification des rappels (`rescheduleAfterChange`), annonce VoiceOver, retour.
- Pas de dialogue « stock négatif » à l'édition (le bandeau de stock bas d'« Aujourd'hui » suffit).

## Étape 1 — Requête d'enregistrement

- [x] `src/features/today/queries/saveIntakeLogChange.ts` : logique du tableau, réutilise `insertIntakeLog`, `decreaseStocks`, `increaseStock`.
- [x] `saveIntakeLogChange.spec.ts` : chaque ligne du tableau (l'absence de stock est déjà couverte par `decreaseStocks` / `increaseStock`).

## Étape 2 — Écran de modification

- [x] Route `src/app/intake-log/_layout.tsx` + `index.tsx` (modèle `src/app/stock/`), déclarée en `modal` dans `src/app/_layout.tsx`. Params : `intakeId`, `date`.
- [x] `src/features/today/hooks/useIntakeLogEditing.ts` : prise du jour via `getIntakesOfDay` + `getIntakeLogsOfDay` (versions respectées), brouillon, `isDirty`, `save`.
- [x] `src/features/today/components/IntakeLogStatusField.tsx`, `IntakeLogMedsField.tsx` ; `IntakeTimeRow` réutilisé (props `label` / `accessibilityLabel`).
- [x] `src/features/today/IntakeLogEditScreen.tsx` (+ `.styles.ts`) : médicaments, statut, heure, `useModalClosing` + `DiscardChangesDialog`.

## Étape 3 — Cartes pressables

- [x] `EarlierIntakeCard.tsx` et `MissedIntakeCard.tsx` : `Pressable` (role `button`, hint « Modifie la prise. », chevron discret, état pressé, cible ≥ 44pt) → `/intake-log`.
- [x] `TodayIntakeSections.tsx` (« Déjà prise » seulement) et `PastDayContent.tsx` (toutes) : passent la date.

## Étape 4 — i18n et accessibilité

- [x] Textes du namespace `today` (« Annuler » / « Enregistrer » dans `common`, « Annuler » de `today` = « Undo »), `make i18n-extract`, traductions FR + EN.
- [x] Heure : label « Heure de prise : 08:05 ». Annonce après enregistrement (« Prise de 08:00 modifiée »).

## Étape 5 — Tests

- [x] `IntakeLogEditScreen.spec.tsx` (statut, heure masquée hors « Prise », enregistrement).
- [x] Specs des cartes (appui → navigation).
- [x] `make tests` vert.
- [x] Flow Maestro : jour passé non pris → prise à une heure → carte « prise » ; aujourd'hui prise → aucune action → revient en attente. `make test-e2e`.

## Étape 6 — Vérification et clôture

- [x] Simulateur : stock correct, rappel du jour revenu après « aucune action », calendrier mis à jour.
- [x] Dynamic Type, VoiceOver, iPhone mini.
- [x] `specs/TODO_vrac.md` : cocher l'item.
