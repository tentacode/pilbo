# Widget iOS

On veut un widget sur l'écran d'accueil d'iOS pour valider une prise en un tap, sans ouvrir l'app.

**Le design est en attente** : il sera fait plus tard sur Claude Design. Il faudra le demander avant de commencer l'implémentation de l'interface du widget.

## Prérequis

- **Compte Apple Developer payant** (99 €/an). Avec le compte gratuit, la capability App Groups est refusée, et le widget ne peut alors pas lire la base de l'app. Le simulateur fonctionne sans compte payant.
- iOS 17 minimum (widgets interactifs avec App Intents).

## Passage au compte payant

À faire avant le widget, une seule fois.

### 1. Inscription

- S'inscrire à l'Apple Developer Program (developer.apple.com/programs/enroll, ou l'app Apple Developer sur l'iPhone), en tant que particulier, avec l'Apple ID actuel.
- La validation par Apple peut prendre de quelques heures à 48 h.
- Abonnement annuel : sans renouvellement, l'app installée ne se lance plus et on revient aux limites du compte gratuit.

### 2. Équipe de signature

- Le compte payant crée une **nouvelle équipe**, avec un Team ID différent de la « Personal Team ».
- Récupérer le Team ID (developer.apple.com/account, « Membership details ») et remplacer `APPLE_TEAM_ID` dans `.env`.
- Xcode > Settings > Accounts : vérifier que la nouvelle équipe apparaît (sans « Personal Team »).

### 3. Identifiant de l'app et données existantes

- À vérifier : `com.tentacode.pilbo` a été enregistré par la Personal Team. La nouvelle équipe ne pourra peut-être pas le réutiliser (« not available »). Dans ce cas, il faut changer de bundle ID.
- iOS refuse en général d'installer par-dessus une app signée par une autre équipe : il faudrait alors **supprimer l'app, et donc ses données**.
- Pas de problème pour l'instant : l'iPhone n'a que des données de test, on peut supprimer l'app sans risque.

### 4. Capabilities

- Signature automatique : Xcode enregistre l'iPhone et crée les profils (valables 1 an).
- App Group `group.com.tentacode.pilbo` (ou selon le bundle ID final), déclaré dans la config Expo pour l'app et pour le widget, afin de survivre à `make clean`.
- `plugins/withoutPushEntitlement.js` n'est plus nécessaire, mais peut rester (on n'utilise pas les notifications push). On le garde pour ne pas élargir le scope.
- Les notifications Time Sensitive deviennent possibles : hors scope, à prévoir dans une spec séparée.

### 5. Vérification

- `make clean`, puis `make build-device` et `make build-release`.
- Vérifier que l'app se lance, que les notifications arrivent, et que la date d'expiration de l'app n'est plus à 7 jours.
- Mettre à jour `CLAUDE.md` (les contraintes liées au compte gratuit ne s'appliquent plus).

## Fonctionnement

### Format

Un seul format dans un premier temps : **moyen (4×2)**, sur l'écran d'accueil. Il laisse de la place pour la liste des médicaments.

### Prise affichée

Le widget affiche la **première prise du jour (la plus tôt) qui n'est ni prise ni ignorée**, avec :

- l'heure de la prise ;
- les médicaments de la prise (nom, force, quantité) ;
- un bouton « Prendre ».

Pas de bouton « Ignorer ».

### États sans prise à valider

- Toutes les prises du jour sont faites : on reprend l'illustration et le texte de l'état « C'est tout pour aujourd'hui » (`TodayDoneState`).
- Aucune prise prévue aujourd'hui : on reprend l'illustration et les textes de l'état vide de « Aujourd'hui » (`TodayEmptyState`, « Rien à prendre aujourd'hui », « Une journée tranquille côté pilulier. … »).

### Bouton « Prendre »

Le bouton fait exactement ce que fait la validation d'une prise dans l'app :

- enregistrement de la prise en base ;
- baisse du stock des médicaments de la prise ;
- replanification complète des notifications (rappels et alertes de stock bas) ;
- mise à jour du widget, qui passe à la prise suivante.

### Tap ailleurs sur le widget

Ouvre l'app sur l'écran « Aujourd'hui ».

## Décisions

### Logique réécrite en Swift

- Toute la logique de validation est **réécrite en Swift** dans l'extension du widget : enregistrement de la prise, baisse du stock, planification des rappels (`planReminders`), alertes de stock bas (`planLowStockAlerts`), badges.
- Le résultat doit être identique à celui de l'app : mêmes identifiants de notification, mêmes textes, même ordre dans la limite des 64, mêmes badges.
- Ajout d'une section **Widget** dans `CLAUDE.md` :
  - le scope du widget ;
  - la liste des fichiers TypeScript dupliqués en Swift (et inversement) ;
  - la règle : toute modification de cette logique dans l'app doit être reportée dans le widget, et inversement.

### Données

- La base SQLite passe dans le conteneur de l'App Group (paramètre `directory` de `openDatabaseSync`).
- Migration du fichier existant au premier lancement, sans perte de données.
- Le widget suit les migrations Drizzle : il vérifie la version du schéma et n'écrit rien si la base n'est pas à jour (il propose alors d'ouvrir l'app).
- Accès concurrents app / widget : mode WAL et délai d'attente si la base est verrouillée.
- Si la planification dépend d'un réglage stocké dans le kv-store (`settingsStore`), il doit aussi être lisible depuis le widget : à vérifier pendant le plan.

### Synchronisation

- L'app demande la mise à jour du widget (`WidgetCenter.reloadAllTimelines()`) après chaque changement qui le concerne : prise validée ou ignorée, prise modifiée, médicament modifié, stock modifié, données supprimées.
- L'app recharge ses données quand elle revient au premier plan, car une validation faite depuis le widget ne déclenche pas le listener de changement de la base.
- Le widget programme ses mises à jour aux heures des prises et à minuit (changement de jour).

### Stock

- Le widget n'affiche rien sur le stock et n'a aucune modale (pas de « stock sous zéro »). La notification de stock bas suffit.
- Il baisse quand même le stock à la validation, sinon les quantités et les alertes de stock bas seraient fausses.

### Mode sombre

- L'app reste en mode clair, mais le widget suit l'apparence d'iOS (clair / sombre), car il vit sur l'écran d'accueil.
- Le design (en attente) doit prévoir une version sombre.
- Couleurs du widget définies pour les deux modes, contraste AA dans chacun.
- Les modes « teinté » et « transparent » de l'écran d'accueil (rendu `accented`) doivent rester lisibles : illustrations et bouton marqués comme accentuables ou désaturables.

### Variantes de l'app

- Deux apps installables côte à côte sur l'iPhone :
  - « Pilbo » (`com.tentacode.pilbo`) : vraies données.
  - « Pilbo Dev » (`com.tentacode.pilbo.dev`) : données de test, section debug.
- Choix de la variante par une variable d'environnement (ex. `APP_VARIANT=dev`) lue dans `app.config.ts` : bundle ID, nom affiché, icône distincte, App Group.
- Chaque variante a son propre widget, sa propre base et ses propres notifications.
- Cibles du `Makefile` adaptées pour construire l'une ou l'autre variante.

### Accessibilité

- Libellés VoiceOver sur le bouton et les informations de la prise.
- Dynamic Type sans casser la mise en page.
- Contraste AA, en clair et en sombre.

### Hors scope

- Bouton « Ignorer ».
- Prises hors planning.
- Autres formats (petit, grand, écran verrouillé, Live Activity).
- Annulation d'une prise validée depuis le widget.

## Assurance qualité

- Tests Swift (XCTest) sur la logique dupliquée, avec les mêmes cas que les tests Jest : même heure fixée, mêmes données, même résultat attendu.
- Vérification sur simulateur et sur l'iPhone :
  - validation depuis le widget, puis contrôle dans l'app (prise, stock, notifications) ;
  - app ouverte en arrière-plan pendant la validation ;
  - changement de jour ;
  - VoiceOver, texte agrandi, mode sombre, mode teinté ;
  - « Pilbo » et « Pilbo Dev » installées en même temps, avec des données et des widgets séparés.
