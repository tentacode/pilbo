# Plan : actions rapides sur les rappels

Spec : `specs/35_notification_actions.md`.

## 1. iOS (prototype, validé sur iPhone)

- [x] Patch `expo-notifications` iOS : `NotificationActionCompletions` (complétion différée des actions personnalisées, tâche d'arrière-plan, sécurité à 25 s) et `completeNotificationAction` dans `EmitterModule`.
- [x] `utils/reminderActions.ts` : identifiants de la catégorie et des actions, `reminderActionStatus`, `reminderIntakeOf`.
- [x] `reminderActionSupport.{ios,android,d}.ts` : enregistrement de la catégorie (libellés i18n) et fin de l'action (no-op sur Android).
- [x] `planReminders` / `resetReminders` : `intakeId` et `intakeDay` dans `data`, `categoryIdentifier` sur les rappels de prise.
- [x] `saveIntakeValidation` extrait de `useIntakeValidation`, réutilisé par `applyReminderAction`.
- [x] `reminderActionHandling.ts` : traitement de l'action (migration, enregistrement, replanification, fin), démarré hors React dans `_layout.tsx`.
- [x] `migrateDatabase` partagé avec `useDatabaseReady`, replanifications exécutées l'une après l'autre.
- [x] `useOpenTabOnNotification` ignore les boutons d'action.
- [x] Traductions FR/EN, tests Jest, `make tests`.
- [x] Checklist sur iPhone en Release (arrière-plan, app tuée, « Ignorer », verrouillé, tap simple).

## 2. Android

- [x] Lire le traitement des actions dans `expo-notifications` Android : il lance déjà une tâche `expo-task-manager` pour un bouton d'action, app en arrière-plan ou tuée.
- [x] Ajouter `expo-task-manager`, tâche déclarée dans `reminderActionSupport.android.ts` (`registerBackgroundReminderActions`).
- [x] Point d'entrée `index.ts` : écoute des actions démarrée avant React (sorti de `_layout.tsx`, iOS compris).
- [x] Catégorie partagée iOS/Android (`reminderActionCategory.ts`), données brutes `dataString` lues par `reminderIntakeOf`.
- [x] Patch Android : la notification disparaît dès l'appui sur un bouton.
- [x] Tests Jest Android (`reminderActionSupport.android.spec.ts`), `make tests`.
- [x] Checklist sur le Galaxy S9 (variante Dev en Release).

## 3. Finitions

- [x] Spec : remplacer « receiver natif » par la tâche `expo-task-manager` dans la section Android.
- [x] `docs/notifications.md` : section « Actions sur les rappels » (fonctionnement, patch iOS et Android, contraintes, test sur appareil).
- [x] Revue du diff complet et `make tests`.
- [ ] Scénarios refaits par Gabriel sur la build TestFlight (démarrage déplacé dans `index.ts` depuis le test iPhone).
- [ ] Test sur TestFlight avec Martin (Apple Watch).
