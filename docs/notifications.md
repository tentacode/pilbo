# Notifications

Notifications **locales** uniquement : l'app les planifie elle-même, iOS les déclenche. Pas de serveur, pas de push.

Validé sur iPhone (spec 02) : notifications app fermée, son custom, badge, annulation. Rappels réels des prises depuis la spec 08.

## Fichiers

| Fichier                                                         | Rôle                                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/config/notifications.ts`                                   | Nombre de rappels, plafond de 64.                                         |
| `src/features/notifications/notifications.ts`                   | Appels iOS : permission, nettoyage, planification.                        |
| `src/features/notifications/rescheduleReminders.ts`             | Lit la base, calcule les rappels, les replanifie.                         |
| `src/features/notifications/utils/planReminders.ts`             | Calcul pur des rappels et des badges (`now` en paramètre).                |
| `src/features/notifications/utils/planLowStockAlerts.ts`        | Calcul pur des alertes de stock bas (`now` en paramètre).                 |
| `src/features/notifications/hooks/useReminderScheduling.ts`     | Replanification au lancement, au premier plan et au changement de langue. |
| `src/features/notifications/hooks/useNotificationPermission.ts` | Statut de la permission (`isGranted`) et demande (`request`).             |
| `src/features/notifications/hooks/useOpenTabOnNotification.ts`  | Ouvre l'onglet de la notification touchée.                                |
| `src/features/notifications/notificationChannels.android.ts`    | Canaux Android (`.ios.ts` sans effet).                                    |
| `plugins/withExactAlarmPermissions.js`                          | Permissions d'alarmes exactes Android.                                    |
| `assets/sounds/beep.wav`                                        | Son custom.                                                               |
| `plugins/withoutPushEntitlement.js`                             | Retire la permission push (compte gratuit).                               |
| `app.config.ts`                                                 | Déclare le son, les plugins et la Team de signature.                      |

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
- appui sur « Je l'ai pris » / « Ignorer » ;
- prise libre d'un médicament (fiche ou « Aujourd'hui »), sa modification et sa suppression ;
- archivage d'un médicament ;
- enregistrement ou suppression d'un stock ;
- enregistrement d'une prise ou d'un médicament depuis le pilulier ;
- changement de langue de l'app (événement `languageChanged` d'i18next, écouté par `useReminderScheduling`).

À chaque déclencheur, `rescheduleReminders(database, now)` :

1. Ne fait rien si la permission n'est pas accordée.
2. Lit les prises du jour et de demain, les logs du jour et les stocks.
3. `planLowStockAlerts()` calcule les alertes de stock bas, `planReminders()` la liste complète.
4. `resetReminders()` fait un **nettoyage complet** (annule les planifiées, efface celles affichées, badge à 0), puis planifie chaque rappel.

Un échec est seulement affiché en console : tout sera replanifié au prochain déclencheur.

## Calcul des rappels (`planReminders`)

| Config (`src/config/notifications.ts`) | Valeur | Rôle                            |
| -------------------------------------- | ------ | ------------------------------- |
| `REMINDER_COUNT`                       | 6      | Rappels par prise.              |
| `MAXIMUM_SCHEDULED_REMINDERS`          | 64     | Limite iOS.                     |
| `LOW_STOCK_ALERT_HOUR`                 | 9      | Heure des alertes de stock bas. |

- **Aujourd'hui** : prises sans log uniquement. Rappels à `heure + n × intake.reminderIntervalMinutes` (n de 0 à 5), seulement ceux encore à venir, même à quelques secondes près (une prise créée pour la minute suivante sonne). Ex. : prise de 08:20, app ouverte à 08:35 → 08:40, 08:50, 09:00, 09:10.
- **Alertes de stock bas** : ajoutées après les rappels du jour, dans la limite de 64.
- **Demain** : ajouté prise par prise (6 rappels entiers) tant que le total reste ≤ 64. Si une journée entière est sautée, les rappels du lendemain existent quand même.
- **Identifiant** : `reminder-<intakeId>-<date locale>` (ex. `reminder-…-2026-10-14T08:40`).
- **Contenu** : titre « C'est l'heure de votre prise de 08:20 », corps « 1 × Lithium 250 mg, 1 × Lamictal 50 mg ». Son `beep.wav`, `interruptionLevel: "active"`.
- **Canal Android** : `channelId` « Rappels de prise » (`intake-reminders`), dans le trigger.
- **Langue** : textes générés dans la langue courante de l'app (`i18n.t`, namespace `notifications`), heure au format 12 h / 24 h du réglage iOS.

### Alertes de stock bas (`planLowStockAlerts`)

- Une alerte à 9h le jour où un stock franchit son seuil (date de fin − seuil, voir `features/stocks/utils/stockForecast.ts`).
- Plusieurs médicaments le même jour : une seule alerte qui les liste.
- Seulement si 9h est encore à venir. Sinon rien : le bandeau et le badge de l'app suffisent.
- Pas d'alerte pour un stock ≤ 0, ni pour un médicament sans prise (pas de date prévisible).
- Rien n'est mémorisé : tout est recalculé à chaque replanification.
- **Identifiant** : `low-stock-<date locale>` (ex. `low-stock-2026-10-22`).
- **Contenu** : titre « Stock bas », corps « Lithium 250 mg, Lamictal 50 mg : pensez à les renouveler. ». Même son que les rappels, **sans `badge`** (le chiffre de l'icône ne change pas). Canal Android « Stock bas » (`low-stock`).

### Badge

Fonctionne app fermée : chaque rappel porte un chiffre calculé à l'avance. C'est le nombre de prises du même jour, sans log, dont l'heure est ≤ l'heure du rappel. iOS l'affiche quand le rappel se déclenche.

## Handler (premier plan)

`setNotificationHandler` : sans lui, iOS n'affiche rien quand l'app est ouverte. Ici : bannière + liste + son + badge.

## Tap sur une notification

`useOpenTabOnNotification` (layout des onglets) choisit l'onglet d'après le préfixe de l'identifiant (`notificationTab`) :

- rappel (`reminder-…`) : « Aujourd'hui », revenu au jour courant ;
- alerte de stock (`low-stock-…`) : « Médicaments ».

Puis `requestTabReset` (`src/shared/navigation/tabResetStore.ts`) : l'écran racine de l'onglet (`useTabReset`) dépile sa pile (calendrier, fiche d'un médicament) et remonte en haut. `router.navigate` seul ne dépile pas : il empilerait un doublon de l'écran racine.

## Permission

- **Jamais demandée au lancement.** Demandée depuis l'onboarding (« Autoriser les notifications ») et la ligne « Notifications » des Réglages (« Activer » tant qu'elles ne sont pas autorisées, « ✓ Autorisées » sinon).
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

## Android

Même code que sur iOS : seuls les canaux et les permissions diffèrent.

### Canaux (`notificationChannels.android.ts`)

| Canal (`NOTIFICATION_CHANNEL_IDS`) | Nom                  | Importance                   | Son        |
| ---------------------------------- | -------------------- | ---------------------------- | ---------- |
| `intake-reminders`                 | « Rappels de prise » | Haute (son + bannière)       | `beep.wav` |
| `low-stock`                        | « Stock bas »        | Normale (son, sans bannière) | `beep.wav` |

- Vibration activée sur les deux.
- Créés par `useReminderScheduling` avant chaque replanification (lancement, premier plan, changement de langue) : le nom suit la langue de l'app.
- Android fige l'importance, le son et la vibration d'un canal à sa création (l'utilisateur peut ensuite les changer dans les réglages). Pour en changer : **nouvel identifiant**, et supprimer l'ancien canal (`deleteNotificationChannelAsync`).
- Les canaux doivent exister avant la demande de permission (Android 13+) : c'est le cas, ils sont créés au lancement.

### Alarmes exactes

`expo-notifications` planifie avec `AlarmManager.setExactAndAllowWhileIdle` si l'app a le droit aux alarmes exactes, sinon l'alarme peut être décalée par Android.

- `USE_EXACT_ALARM` (Android 13+) : accordée d'office, réservée aux apps d'alarme, de calendrier et de rappels (Google Play le vérifie).
- `SCHEDULE_EXACT_ALARM` (`maxSdkVersion="32"`) : Android 12.
- Ajoutées par `plugins/withExactAlarmPermissions.js`. Vérifier : `adb shell dumpsys alarm | grep -A1 com.tentacode.pilbo` → `RTC_WAKEUP`, `window=0`.

### Permission

- Android 13+ : popup système (`POST_NOTIFICATIONS`), même parcours que sur iOS (onboarding, Réglages).
- Android autorise **deux** demandes : après deux refus, `canAskAgain` passe à `false` et « Activer » ouvre les infos de l'app (`Linking.openSettings()`).
- Android 11 et 12 : accordée à l'installation.

### Redémarrage

`expo-notifications` déclare `RECEIVE_BOOT_COMPLETED` et replanifie les notifications enregistrées au démarrage du téléphone, sans ouvrir l'app.

### Badge

Le chiffre de `setBadgeCountAsync` et de `badge` dépend du lanceur (souvent un simple point sur l'icône). Pas d'erreur s'il n'est pas géré.

### Économie d'énergie

Les fabricants (Samsung, etc.) peuvent mettre en veille les apps peu ouvertes et retarder leurs alarmes. À surveiller sur un vrai téléphone (spec 17, étape 13) avant d'agir.

### Tester sur Android

1. `make android-build-device` (ou `make android-build-release`).
2. Ouvrir l'app → autoriser → fermer l'app → attendre les notifications.
3. Canaux : `adb shell dumpsys notification | grep "NotificationChannel{" | grep pilbo`.
