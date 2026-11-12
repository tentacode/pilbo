# 32 — Relances regroupées par prise

## Contexte

- Bug (`specs/TODO_vrac.md`) : deux prises à la même heure donnent 4 sur l'icône Android au lieu de 2.
- Cause : chaque rappel porte `badge: countPendingAt(date)`. Android le transforme en `setNumber()` par notification, et le lanceur additionne (2 + 2). Les 6 relances s'empilent aussi dans le volet, et le chiffre grossit encore.
- iOS : le badge est juste (valeur absolue), mais les relances s'empilent dans le centre de notifications.
- Objectif :
  - Android : une seule notification par prise dans le volet, chaque relance remplace la précédente, chiffre de l'icône = nombre de notifications.
  - iOS : badge inchangé, relances d'une même prise regroupées en une pile.

## Contrainte

expo-notifications ne permet ni l'un ni l'autre en l'état :

- **Android** : la notification affichée a pour tag l'identifiant de la requête (`ExpoPresentationDelegate.presentNotification`) et un id constant.
- **iOS** : `threadIdentifier` n'est jamais appliqué à la planification (`NotificationRecords.swift`, `toUNMutableNotificationContent`).

Solution : un patch pnpm de quelques lignes, piloté par une clé `data.presentationGroup`. À revérifier à chaque montée de version d'expo-notifications.

## Étapes

- [x] 0. Copier le plan dans `plans/32_notification_grouping.md`.
- [x] 1. Patch expo-notifications (`pnpm patch`, `pnpm patch-commit`) :
  - Android `ExpoPresentationDelegate.kt` : tag = `data.presentationGroup` s'il est non vide, sinon l'identifiant.
  - iOS `NotificationRecords.swift` : `threadIdentifier` depuis `data["presentationGroup"]`.
  - Android : `expo.autolinking.android.buildFromSource: ["expo-notifications"]` dans `package.json`, sinon l'AAR précompilé ignore le patch. Kotlin compilé (`gradlew :expo-notifications:compileDebugKotlin`).
- [x] 2. Groupe par prise et par jour dans `planReminders.ts` : `presentationGroup: "reminder-<intakeId>-<date locale>"` (absent pour le stock bas).
- [x] 3. Badge selon la plateforme : `utils/reminderBadge.ios.ts`, `utils/reminderBadge.android.ts` (pas de badge), contrat `reminderBadge.d.ts`.
- [x] 4. `resetReminders` (`notifications.ts`) : passe `data: { presentationGroup }` quand il est défini.
- [x] 5. Tests Jest : groupes dans `planReminders.spec.ts`, `reminderBadge.android.spec.ts`.
- [x] 6. Docs : `docs/notifications.md`. Proposer une ligne pour `CLAUDE.md` sur le patch.
- [x] 7. `make tests` au vert.
- [ ] 8. Vérification sur appareil (avec toi) : deux prises à la même heure + relance courte, app fermée.
  - Android (S9) : 2 notifications dans le volet, le chiffre reste à 2 après une relance.
  - iOS : badge 2, une pile par prise dans le centre de notifications.
- [ ] 9. Cocher la ligne du bug dans `specs/TODO_vrac.md`.

## Hors périmètre

- Alerte de stock bas sur Android : le lanceur la compte pour 1 (déjà le cas avant).
