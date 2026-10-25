# Widget iOS

On veut un widget sur l'écran d'accueil d'iOS pour valider une prise en un tap, sans ouvrir l'app.

**Le design est en attente** : il sera fait plus tard sur Claude Design. Il faudra le demander avant de commencer l'implémentation de l'interface du widget.

## Prérequis

- **Spec 23 faite** : compte Apple Developer payant, équipe de signature, variantes Pilbo / Pilbo Dev, TestFlight.
- iOS 17 minimum (widgets interactifs avec App Intents).
- App Group `group.<bundle ID>` (une par variante), déclaré dans la config Expo pour l'app et pour le widget, afin de survivre à `make clean`.

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
- Migration du fichier existant au premier lancement, sans perte de données (obligatoire : les testeurs TestFlight ont de vraies données).
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
