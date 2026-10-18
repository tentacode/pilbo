# Notifications

Notifications **locales** uniquement : l'app les planifie elle-même, iOS les déclenche. Pas de serveur, pas de push.

Validé sur iPhone (spec 02) : notifications app fermée, son custom, badge, annulation. Rappels réels des prises depuis la spec 08.

## Fichiers

| Fichier                                                         | Rôle                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| `src/config/notifications.ts`                                   | Nombre de rappels, délai minimum, plafond de 64.              |
| `src/features/notifications/notifications.ts`                   | Appels iOS : permission, nettoyage, planification.            |
| `src/features/notifications/rescheduleReminders.ts`             | Lit la base, calcule les rappels, les replanifie.             |
| `src/features/notifications/utils/planReminders.ts`             | Calcul pur des rappels et des badges (`now` en paramètre).    |
| `src/features/notifications/hooks/useReminderScheduling.ts`     | Replanification au lancement et au premier plan.              |
| `src/features/notifications/hooks/useNotificationPermission.ts` | Statut de la permission (`isGranted`) et demande (`request`). |
| `assets/sounds/beep.wav`                                        | Son custom.                                                   |
| `plugins/withoutPushEntitlement.js`                             | Retire la permission push (compte gratuit).                   |
| `app.config.ts`                                                 | Déclare le son, les plugins et la Team de signature.          |

## Configuration (`app.config.ts`)

1. **Son** : déclaré dans le plugin `expo-notifications` → `sounds`. Il est copié dans l'app au `prebuild`.
2. **Push retiré** : `./plugins/withoutPushEntitlement` est déclaré **avant** `expo-notifications`.
   - `expo-notifications` ajoute toujours `aps-environment` (push), interdit avec un compte gratuit.
   - Les mods iOS s'exécutent en ordre inverse : déclaré avant = exécuté après → il peut retirer la permission.
3. **Team de signature** : `ios.appleTeamId`, lu depuis `APPLE_TEAM_ID` (`.env`) → conservée après `npx expo prebuild --clean`.

## Principe : tout effacer, tout replanifier

Déclencheurs :

- lancement de l'app ;
- permission accordée depuis la popup ;
- retour au premier plan (`AppState` → `active`) ;
- appui sur « Je l'ai pris » / « Ignorer ».

À chaque déclencheur, `rescheduleReminders(database, now)` :

1. Ne fait rien si la permission n'est pas accordée.
2. Lit les prises du jour et de demain, et les logs du jour.
3. `planReminders()` calcule la liste des rappels.
4. `resetReminders()` fait un **nettoyage complet** (annule les planifiées, efface celles affichées, badge à 0), puis planifie chaque rappel.

Un échec est seulement affiché en console : tout sera replanifié au prochain déclencheur.

## Calcul des rappels (`planReminders`)

| Config (`src/config/notifications.ts`)  | Valeur | Rôle                                                      |
| --------------------------------------- | ------ | --------------------------------------------------------- |
| `REMINDER_COUNT`                        | 6      | Rappels par prise.                                        |
| `MINIMUM_DELAY_BEFORE_REMINDER_SECONDS` | 60     | Un rappel prévu dans moins d'une minute n'est pas recréé. |
| `MAXIMUM_SCHEDULED_REMINDERS`           | 64     | Limite iOS.                                               |

- **Aujourd'hui** : prises sans log uniquement. Rappels à `heure + n × intake.reminderIntervalMinutes` (n de 0 à 5), seulement ceux encore à venir. Ex. : prise de 08:20, app ouverte à 08:35 → 08:40, 08:50, 09:00, 09:10.
- **Demain** : ajouté prise par prise (6 rappels entiers) tant que le total reste ≤ 64. Si une journée entière est sautée, les rappels du lendemain existent quand même.
- **Identifiant** : `reminder-<intakeId>-<date locale>` (ex. `reminder-…-2026-10-14T08:40`).
- **Contenu** : titre « C'est l'heure de votre prise de 08:20 », corps « 1 × Lithium 250 mg, 1 × Lamictal 50 mg ». Son `beep.wav`, `interruptionLevel: "active"`.

### Badge

Fonctionne app fermée : chaque rappel porte un chiffre calculé à l'avance. C'est le nombre de prises du même jour, sans log, dont l'heure est ≤ l'heure du rappel. iOS l'affiche quand le rappel se déclenche.

## Handler (premier plan)

`setNotificationHandler` : sans lui, iOS n'affiche rien quand l'app est ouverte. Ici : bannière + liste + son + badge.

## Permission

- **Jamais demandée au lancement.** Demandée depuis l'onboarding (« Autoriser les notifications ») et les Réglages (« Accepter les notifications »).
- `useNotificationPermission()` : `isGranted` relu au focus de l'écran et au retour au premier plan. `request()` selon `getPermissionStatus()` :
  - `undetermined` (jamais demandée) : popup système (`requestPermission()`), puis replanification si accordée.
  - `denied` : ouvre les Réglages iOS (`Linking.openSettings()`).
  - `granted` : rien.
- iOS n'affiche la fenêtre qu'**une seule fois**. Ensuite → Réglages → Pilbo → Notifications.
- Pas accordée : message « Les rappels sont désactivés » sur l'écran « Aujourd'hui », bouton « Activer les notifications » (`request()`).

## Niveaux de priorité (`interruptionLevel`)

| Niveau          | Effet                                    | Pour Pilbo                            |
| --------------- | ---------------------------------------- | ------------------------------------- |
| `passive`       | Ni son, ni bannière, ni écran allumé.    | Inutile pour des rappels.             |
| `active`        | Son + bannière (défaut iOS).             | ✅ Utilisé.                           |
| `timeSensitive` | Passe à travers les modes Concentration. | Idéal, mais **compte payant** requis. |

## Contraintes iOS

- **64 notifications planifiées max** par app, identique avec un compte gratuit ou payant. 4 prises × 6 rappels × 2 jours = 48.
- **Mode silencieux** : pas de son, vibration seulement si « Vibrer en mode silencieux » est activé.
- **Son custom** : `.wav`, `.caf` ou `.aiff`, moins de 30 s.
- **Compte gratuit** : ni Push, ni Time Sensitive (la signature échoue).

## Tester sur iPhone

1. `make clean` (si `app.config.ts` ou les plugins ont changé).
2. `make build-device` (ou `make build-release` pour une app autonome).
3. Ouvrir l'app → autoriser → fermer l'app → attendre les notifications.

Le Mac n'est utile qu'à l'ouverture de l'app (Metro). Une fois planifiées, iOS gère les notifications seul.
