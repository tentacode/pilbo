# Spec 02 — PoC notifications

## Contexte

Valider que les notifications locales iOS fonctionnent (son custom, 3 niveaux de priorité, app fermée) sur l'iPhone avec un compte Apple gratuit. Code jetable, conventions allégées (textes en dur en anglais, pas de tokens ni de tests, accessibilité de base).

Décisions validées :

- « I took my meds » : annule les notifications planifiées + efface celles déjà affichées.
- Lancement / « Reset timers » : annule d'abord, puis planifie 5 notifications (+1 à +5 min).
- App ouverte : la notification s'affiche avec le son.

> Chaque case doit être vérifiée et validée par toi avant de passer à la suivante : je m'arrête après chaque étape et j'attends ton feu vert.

## Étape 0 — Plan

- [x] Copier le plan dans `./plans/02_notification_proof_of_concept.md`.

## Étape 1 — Dépendance

- [x] Installer `expo-notifications` (`npx expo install`).

## Étape 2 — Son custom

- [x] Générer un `beep.wav` court (< 30 s) dans `assets/sounds/`.
- [x] Le déclarer dans le plugin `expo-notifications` (`sounds`) de `app.json`.

## Étape 3 — Compte gratuit (push)

- [x] Config plugin local `plugins/withoutPushEntitlement.js` qui retire `aps-environment` (push inutile pour du local, sinon la signature échoue).

## Étape 4 — Time Sensitive

- [x] Ajouter l'entitlement `com.apple.developer.usernotifications.time-sensitive` dans `ios.entitlements`.
- [x] Si la signature échoue avec le compte gratuit : le retirer et te le signaler. → Échec confirmé (« Personal development teams do not support the Time Sensitive Notifications capability »), permission retirée. `ios.appleTeamId` ajouté dans `app.json` pour garder la Team après chaque prebuild.

## Étape 5 — Logique notifications (`src/notifications.ts`)

- [x] `PRIORITY` : variable à changer pour tester (`passive` / `active`, défaut `active`). Time Sensitive impossible avec le compte gratuit.
- [x] `setNotificationHandler` (bannière + son + badge au premier plan).
- [x] `requestPermission()` (alertes, son, badge).
- [x] `scheduleReminders()` : annule puis 5 × `TIME_INTERVAL` (60 s…300 s), message « It's time for your meds: 1x lithium 50mg, 1x lamictal 25mg », `sound: "beep.wav"`, `badge: 1`, `interruptionLevel: PRIORITY`.
- [x] `clearReminders()` : annule les planifiées + efface les affichées + remet le badge à 0.

## Étape 6 — Écran (`src/app/index.tsx`)

- [x] État `shouldTakeMeds` (`useState(true)`) + texte d'état.
- [x] Bouton « I took my meds » / « Reset timers » (`accessibilityRole="button"`, cible ≥ 44pt). « Reset timers » remet l'état initial (`true`) et replanifie.
- [x] Au montage : permission puis `scheduleReminders()`.
- [x] `npx tsc --noEmit` passe. ESLint pas encore configuré (hors scope), lint ignoré.

## Étape 7 — Build iPhone

- [x] `npx expo prebuild --clean` + build sur l'iPhone (`npx expo run:ios --device`, Debug).

## Étape 8 — Vérification (toi, sur l'iPhone)

- [x] Lancer l'app, la fermer → 5 notifications à 1 min d'intervalle, avec le son custom.
- [x] Badge 1 sur l'icône quand une notification arrive (app fermée).
- [x] « I took my meds » → notifications et badge effacés, plus rien n'arrive, texte « Med has been taken ».
- [x] « Reset timers » → 5 nouvelles notifications.
- [x] Tester chaque niveau via `PRIORITY` : Active validé. Passive non testé (inutile pour des rappels : ni son ni bannière). Time Sensitive à étudier avec un compte payant (passe les modes Concentration).

## Étape 9 — Paramètres de `scheduleReminders()` (après nettoyage)

Compatible avec la future refacto des prises multiples : à l'ouverture de l'app, on annule tout puis on recrée tout.

- [x] Refacto de `src/notifications.ts` : `ReminderOptions` (`startDate`, `message`, `badge`, `count` = 6, `minutesBetweenReminders` = 10), déclencheur `DATE`, `cancelScheduledReminders()` séparé.
- [x] Mettre à jour `docs/notifications.md`.
- [x] `npx tsc --noEmit` passe.
