# Notifications

Notifications **locales** uniquement : l'app les planifie elle-même, iOS les déclenche. Pas de serveur, pas de push.

Validé sur iPhone (spec 02) : notifications app fermée, son custom, badge, annulation. Rappels réels des prises depuis la spec 08.

## Fichiers

| Fichier                                                         | Rôle                                                                                   |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/config/notifications.ts`                                   | Nombre de rappels, plafond de 64, identifiants des canaux Android.                     |
| `src/domain/sound.ts`                                           | Liste et ordre des sons (`NOTIFICATION_SOUNDS`), fichier d'un son.                     |
| `src/features/notifications/notifications.ts`                   | Appels iOS : permission, nettoyage, planification.                                     |
| `src/features/notifications/rescheduleReminders.ts`             | Lit la base, calcule les rappels, les replanifie.                                      |
| `src/features/notifications/utils/planReminders.ts`             | Calcul pur des rappels et des badges (`now` en paramètre).                             |
| `src/features/notifications/utils/planLowStockAlerts.ts`        | Calcul pur des alertes de stock bas (`now` en paramètre).                              |
| `src/features/notifications/utils/reminderBadge.ios.ts`         | Badge d'un rappel : le nombre de prises en attente (`.android.ts` : aucun).            |
| `patches/expo-notifications.patch`                              | Groupe de présentation (voir [Groupe de présentation](#groupe-de-présentation-patch)). |
| `src/features/notifications/hooks/useReminderScheduling.ts`     | Replanification au lancement, au premier plan et au changement de langue.              |
| `src/features/notifications/hooks/useNotificationPermission.ts` | Statut de la permission (`isGranted`) et demande (`request`).                          |
| `src/features/notifications/hooks/useOpenTabOnNotification.ts`  | Ouvre l'onglet de la notification touchée.                                             |
| `src/features/notifications/notificationChannels.android.ts`    | Canaux Android (`.ios.ts` sans effet).                                                 |
| `src/features/notifications/SoundPickerScreen.tsx`              | Écran de choix d'un son (prise, réglages).                                             |
| `src/features/notifications/hooks/useSoundPreview.ts`           | Écoute d'un son dans l'écran de choix (`expo-audio`).                                  |
| `plugins/withExactAlarmPermissions.js`                          | Permissions d'alarmes exactes Android.                                                 |
| `assets/sounds/`                                                | Sons des notifications (`make sounds`, sauf `beep.wav`).                               |
| `scripts/generateSounds.mjs`                                    | Génère les sons et `silence.wav`.                                                      |
| `plugins/withoutPushEntitlement.js`                             | Retire la permission push (compte gratuit).                                            |
| `app.config.ts`                                                 | Déclare les sons, les plugins et la Team de signature.                                 |

## Configuration (`app.config.ts`)

1. **Sons** : tous les fichiers de `NOTIFICATION_SOUNDS` (via `soundFileOf`) sont déclarés dans le plugin `expo-notifications` → `sounds`. Ils sont copiés dans l'app au `prebuild`.
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

1. Crée les canaux Android des sons utilisés et supprime les autres (voir [Canaux](#canaux-notificationchannelsandroidts)). Sons lus dans `useSettingsStore`.
2. S'arrête là si la permission n'est pas accordée.
3. Lit les prises du jour et de demain, les logs du jour et les stocks.
4. `planLowStockAlerts()` calcule les alertes de stock bas, `planReminders()` la liste complète.
5. `resetReminders()` fait un **nettoyage complet** (annule les planifiées, efface celles affichées, badge à 0), puis planifie chaque rappel.

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
- **Contenu** : titre « C'est l'heure de votre prise de 08:20 », corps « 1 × Lithium 250 mg, 1 × Lamictal 50 mg ». Son de la prise (`intake.sound`), `interruptionLevel: "timeSensitive"`.
- **Canal Android** : `channelId` du son de la prise (`reminderChannelId`), dans le trigger.
- **Groupe de présentation** : `presentationGroup` = `reminder-<intakeId>-<date locale du jour>` (ex. `reminder-…-2026-10-14`), le même pour les 6 rappels d'une prise. Envoyé dans `data.presentationGroup`, voir [Groupe de présentation](#groupe-de-présentation-patch).
- **Langue** : textes générés dans la langue courante de l'app (`i18n.t`, namespace `notifications`), heure au format 12 h / 24 h du réglage iOS.

### Alertes de stock bas (`planLowStockAlerts`)

- Une alerte à 9h le jour où un stock franchit son seuil (date de fin − seuil, voir `features/stocks/utils/stockForecast.ts`).
- Plusieurs médicaments le même jour : une seule alerte qui les liste.
- Seulement si 9h est encore à venir. Sinon rien : le bandeau et le badge de l'app suffisent.
- Pas d'alerte pour un stock ≤ 0, ni pour un médicament sans prise (pas de date prévisible).
- Rien n'est mémorisé : tout est recalculé à chaque replanification.
- **Identifiant** : `low-stock-<date locale>` (ex. `low-stock-2026-10-22`).
- **Contenu** : titre « Stock bas », corps « Lithium 250 mg, Lamictal 50 mg : pensez à les renouveler. ». Son des alertes (réglage `lowStockSound`), `interruptionLevel: "active"`, **sans `badge`** (le chiffre de l'icône ne change pas). Canal Android du son (`lowStockChannelId`).

### Sons

| Clé (`NotificationSound`) | Fichier                     | Nom (FR)            |
| ------------------------- | --------------------------- | ------------------- |
| `beep_short`              | `beep_short.wav`            | Beep Boop           |
| `beep` (défaut)           | `beep.wav`                  | Beep Boop Beep Boop |
| `chime`                   | `chime.wav`                 | Sonnette            |
| `drop`                    | `drop.wav`                  | Glissade            |
| `pill_rattle`             | `pill_rattle.wav`           | Secoue ton pilbo    |
| `gentle_alert_resolved`   | `gentle_alert_resolved.wav` | Fantôme             |
| `nocturne`                | `nocturne.wav`              | Nocturne            |
| `shire`                   | `shire.wav`                 | Pilbo Sacquet       |
| `vibration`               | `silence.wav`               | Vibration seule     |

- Chaque prise a son son (colonne `intake.sound`), réglé dans l'écran de la prise (`/intake/sound`). Une nouvelle prise reçoit le son par défaut des réglages (`defaultReminderSound`).
- Les alertes de stock bas utilisent toutes `lowStockSound` (réglages).
- Changer le son par défaut propose de l'appliquer à toutes les prises actives (`setAllActiveIntakesSound`), si au moins une a un autre son.
- **Vibration seule** : iOS joue `silence.wav` (0,5 s de silence). Testé sur iPhone, app fermée : la notification vibre en mode sonnerie et en mode silencieux (selon les réglages haptiques). Android : canal sans son, vibration activée.
- **Écoute** (`useSoundPreview`, `expo-audio`) : joue même en mode silencieux (`playsInSilentMode`), baisse la musique en cours sans la couper (`duckOthers`). expo-audio libère la session à la fin du son, la musique reprend. « Vibration seule » fait vibrer le téléphone (`Vibration.vibrate()`). Le son s'arrête quand on quitte l'écran.
- Plugin `expo-audio` : sans enregistrement ni lecture en arrière-plan. Le texte d'usage du micro est déclaré seulement parce que le module contient du code d'enregistrement (exigé par App Store Connect), le micro n'est jamais demandé.
- **Générer les sons** : `make sounds` (`scripts/generateSounds.mjs`), sauf `beep.wav` (fichier d'origine).

### Badge

Fonctionne app fermée : chaque rappel porte un chiffre calculé à l'avance. C'est le nombre de prises du même jour, sans log, dont l'heure est ≤ l'heure du rappel. iOS l'affiche quand le rappel se déclenche.

iOS uniquement (`reminderBadge.ios.ts`) : sur Android, aucun `badge` (voir [Badge Android](#badge-1)).

### Groupe de présentation (patch)

expo-notifications ne sait ni remplacer une notification affichée par une autre planifiée, ni regrouper des notifications locales. Un patch pnpm (`patches/expo-notifications.patch`, `patchedDependencies` dans `pnpm-workspace.yaml`) lit `data.presentationGroup` :

- **Android** (`ExpoPresentationDelegate.kt`) : tag de la notification affichée = le groupe (l'identifiant sinon). Une relance **remplace** la précédente dans le volet : une notification par prise en attente. Le son rejoue à chaque relance.
- **iOS** (`NotificationRecords.swift`) : `threadIdentifier` = le groupe. Les relances d'une prise forment **une pile** dans le centre de notifications.

Android utilise par défaut un AAR précompilé d'expo-notifications, qui ignorerait le patch : `expo.autolinking.android.buildFromSource` (`package.json`) force la compilation depuis les sources. iOS compile déjà depuis les sources.

L'identifiant de la requête ne change pas (tap, annulation). Montée de version d'expo-notifications : `pnpm install` échoue si le patch ne s'applique plus, le refaire avec `pnpm patch expo-notifications`.

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

Un canal par type et par son : Android fige le son d'un canal à sa création.

| Canal                                               | Nom                               | Importance                   | Son         |
| --------------------------------------------------- | --------------------------------- | ---------------------------- | ----------- |
| `intake-reminders` (`beep`)                         | « Rappels de prise – Beep Boop… » | Haute (son + bannière)       | `beep.wav`  |
| `intake-reminders-<clé>` (autres sons)              | « Rappels de prise – Sonnette »   | Haute (son + bannière)       | `<clé>.wav` |
| `low-stock` (`beep`)                                | « Stock bas – Beep Boop… »        | Normale (son, sans bannière) | `beep.wav`  |
| `low-stock-<clé>` (autres sons)                     | « Stock bas – Sonnette »          | Normale (son, sans bannière) | `<clé>.wav` |
| `intake-reminders-vibration`, `low-stock-vibration` | « … – Vibration seule »           | Selon le type                | aucun       |

- Identifiants : `reminderChannelId(sound)` / `lowStockChannelId(sound)` (`src/config/notifications.ts`). `beep` garde les identifiants d'origine.
- Vibration activée sur tous.
- Créés par `rescheduleReminders` à chaque replanification, avant le test de permission : le nom suit la langue de l'app.
- Sons utilisés : son par défaut des rappels et sons de toutes les prises actives (les canaux restent stables d'un jour à l'autre), son des alertes de stock. Les autres canaux Pilbo (`intake-reminders…`, `low-stock…`) sont supprimés (`deleteNotificationChannelAsync`), après la création des nouveaux.
- Android fige l'importance, le son et la vibration d'un canal à sa création (l'utilisateur peut ensuite les changer dans les réglages). Pour changer l'importance : **nouvel identifiant**, et supprimer l'ancien canal.
- Les canaux doivent exister avant la demande de permission (Android 13+) : c'est le cas, le canal du son par défaut des rappels existe toujours.

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

`badge` devient `setNumber()` sur **chaque** notification, et les lanceurs additionnent ces nombres (deux rappels avec `badge: 2` → 4). Les rappels n'ont donc pas de `badge` sur Android : le lanceur compte les notifications affichées, une par prise grâce au [groupe de présentation](#groupe-de-présentation-patch). L'alerte de stock bas compte aussi pour 1.

### Économie d'énergie

Les fabricants (Samsung, etc.) peuvent mettre en veille les apps peu ouvertes et retarder leurs alarmes. À surveiller sur un vrai téléphone (spec 17, étape 13) avant d'agir.

### Tester sur Android

1. `make android-build-device` (ou `make android-build-release`).
2. Ouvrir l'app → autoriser → fermer l'app → attendre les notifications.
3. Canaux : `adb shell dumpsys notification | grep "NotificationChannel{" | grep pilbo`.
