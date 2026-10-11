# Notifications

Notifications **locales** uniquement : l'app les planifie elle-même, iOS les déclenche. Pas de serveur, pas de push.

Validé sur iPhone (spec 02) : notifications app fermée, son custom, badge, annulation.

## Fichiers

| Fichier                                       | Rôle                                                      |
| --------------------------------------------- | --------------------------------------------------------- |
| `src/features/notifications/notifications.ts` | Toute la logique (permission, planification, effacement). |
| `assets/sounds/beep.wav`                      | Son custom.                                               |
| `plugins/withoutPushEntitlement.js`           | Retire la permission push (compte gratuit).               |
| `app.config.ts`                               | Déclare le son, les plugins et la Team de signature.      |

## Configuration (`app.config.ts`)

1. **Son** : déclaré dans le plugin `expo-notifications` → `sounds`. Il est copié dans l'app au `prebuild`.
2. **Push retiré** : `./plugins/withoutPushEntitlement` est déclaré **avant** `expo-notifications`.
   - `expo-notifications` ajoute toujours `aps-environment` (push), interdit avec un compte gratuit.
   - Les mods iOS s'exécutent en ordre inverse : déclaré avant = exécuté après → il peut retirer la permission.
3. **Team de signature** : `ios.appleTeamId`, lu depuis `APPLE_TEAM_ID` (`.env`) → conservée après `npx expo prebuild --clean`.

## Logique (`src/features/notifications/notifications.ts`)

### Handler (premier plan)

`setNotificationHandler` : sans lui, iOS n'affiche rien quand l'app est ouverte. Ici : bannière + liste + son + badge.

### `requestPermission()`

- Demande alertes, son, badge.
- iOS n'affiche la fenêtre qu'**une seule fois**. Ensuite → Réglages → Pilbo → Notifications.
- Renvoie `true` si autorisé.

### Principe : annuler tout, recréer tout

À chaque ouverture de l'app (désactivé depuis la spec 03, plus rien n'est planifié au lancement) :

1. `cancelScheduledReminders()` → plus aucun rappel planifié.
2. `scheduleReminders()` une fois **par prise** (ex : 8h30, 12h, 20h30).

But : empiler un maximum de rappels dans la limite iOS de 64.

### `cancelScheduledReminders()`

Annule tous les rappels planifiés (ceux déjà affichés restent).

### `scheduleReminders(options)`

Ajoute les rappels d'**une** prise. N'annule rien.

| Option                    | Rôle                  | Défaut      |
| ------------------------- | --------------------- | ----------- |
| `startDate`               | Heure du 1er rappel   | obligatoire |
| `message`                 | Texte, déjà traduit   | obligatoire |
| `badge`                   | Chiffre sur l'icône   | obligatoire |
| `count`                   | Nombre de rappels     | 6           |
| `minutesBetweenReminders` | Écart entre 2 rappels | 10          |

Chaque rappel :

- se déclenche à une heure précise (`DATE`) : `startDate + n × minutesBetweenReminders` ;
- a un `identifier` basé sur son heure (`reminder-<date ISO>`) → un double appel remplace au lieu de dupliquer ;
- utilise `sound: "beep.wav"` et `interruptionLevel: "active"`.

### `clearReminders()`

1. Annule les notifications planifiées.
2. Efface celles déjà affichées.
3. Remet le badge à 0.

## Niveaux de priorité (`interruptionLevel`)

| Niveau          | Effet                                    | Pour Pilbo                            |
| --------------- | ---------------------------------------- | ------------------------------------- |
| `passive`       | Ni son, ni bannière, ni écran allumé.    | Inutile pour des rappels.             |
| `active`        | Son + bannière (défaut iOS).             | ✅ Utilisé.                           |
| `timeSensitive` | Passe à travers les modes Concentration. | Idéal, mais **compte payant** requis. |

## Contraintes iOS

- **64 notifications planifiées max** par app → plus tard, rappels quotidiens répétés (1 slot chacun).
- **Mode silencieux** : pas de son, vibration seulement si « Vibrer en mode silencieux » est activé.
- **Son custom** : `.wav`, `.caf` ou `.aiff`, moins de 30 s.
- **Compte gratuit** : ni Push, ni Time Sensitive (la signature échoue).

## Tester sur iPhone

1. `npx expo prebuild --clean` (si `app.config.ts` ou les plugins ont changé).
2. `npx expo run:ios --device`.
3. Ouvrir l'app → autoriser → fermer l'app → attendre les notifications.

Le Mac n'est utile qu'à l'ouverture de l'app (Metro). Une fois planifiées, iOS gère les notifications seul.
