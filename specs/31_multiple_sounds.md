# Nouveaux sons dans pilbo

Pour personnaliser un peu plus l'expérience, on va rajouter des sons dans Pilbo.

## Fonctionnement

Par défaut, l'alerte de prise et l'alerte de stock utilisent toutes les deux « beep.wav », comme c'était déjà le cas.

On peut changer le son par défaut des notifications de prise et de stock.

Chaque prise peut avoir un son différent des autres prises, réglé dans l'écran de modification de la prise.

Si des prises existent et qu'on change le son par défaut, une popup demande si on veut l'appliquer à toutes les prises existantes.

On ne peut pas mettre un son différent pour chaque alerte de stock : le son se change dans les réglages et sert pour toutes les alertes de stock.

On peut aussi choisir de ne pas avoir de son, seulement la vibration (« Vibration seule »).

## Interface

Deux possibilités : un composant natif ou un écran à part.

Je penche plutôt pour l'écran à part, puisqu'il sera plus simple d'y écouter les sons avant de choisir. Je ne suis pas fermé au composant natif, si on peut le faire avec.

→ Écran à part, voir les décisions.

## Noms, ordre et traduction

L'ordre affiché est l'ordre de cette liste.

| Fichier                   | Nom fr              | Nom en              |
| ------------------------- | ------------------- | ------------------- |
| beep_short.wav            | Beep Boop           | Beep Boop           |
| beep.wav                  | Beep Boop Beep Boop | Beep Boop Beep Boop |
| chime.wav                 | Sonnette            | Doorbell            |
| drop.wav                  | Glissade            | Slippery            |
| pill_rattle.wav           | Secoue ton pilbo    | Shake your pilbo    |
| gentle_alert_resolved.wav | Fantôme             | Spooky              |
| nocturne.wav              | Nocturne            | Nocturne            |
| shire.wav                 | Pilbo Sacquet       | Pilbo Baggins       |
| silence.wav (iOS)         | Vibration seule     | Vibration only      |

## Décisions

### Stockage

- Nouvelle colonne `sound` sur la table `intake` : texte, obligatoire, `"beep"` par défaut. Elle contient la clé du son, c'est-à-dire le nom du fichier sans extension (ex. `chime`), ou `vibration` pour « Vibration seule ».
- La colonne fait partie de la migration « en cours », et les prises existantes passent à `beep`.
- Réglages (`settingsStore`, Zustand persisté) : `defaultReminderSound` et `lowStockSound`, `beep` par défaut.
- La liste des sons (ordre, fichier, nom traduit) vit dans `domain/`.
- Changer le son d'une prise la modifie sur place, sans nouvelle version (comme l'intervalle de rappel).
- Une nouvelle prise reçoit le son par défaut des rappels.

### Écran de choix du son

- C'est un écran à part, en modale `Sheet` (comme le choix d'un médicament) :
  - empilé dans la modale de prise (`/intake/sound`) ;
  - ouvert en modale depuis les réglages.
- Il affiche la liste des sons dans l'ordre du tableau, avec une sélection de type radio.
- Un appui sélectionne le son et le joue, en coupant celui en cours. Pour « Vibration seule », un appui sélectionne et fait vibrer le téléphone.
- Le son s'arrête quand on quitte l'écran.
- « Annuler » en haut garde l'ancien son. Le bouton « Valider » en pied de modale retient le son choisi.
- L'écoute passe par `expo-audio` (nouvelle dépendance native, rebuild nécessaire).
  - Elle joue même quand l'iPhone est en mode silencieux (`playsInSilentMode`).
  - La musique en cours baisse le temps du son, elle n'est pas coupée.
- Accessibilité : rôle radio, état sélectionné, le nom du son en libellé, et une indication qui précise qu'un appui joue le son.

### Points d'entrée

- Écran de modification de la prise : une ligne « Son » sous l'intervalle de rappel. Elle affiche le nom du son et ouvre l'écran de choix.
- Réglages :
  - section « Rappels » : ligne « Son par défaut » ;
  - section « Stock » : ligne « Son des alertes ».
- Le texte d'aide de la section « Rappels » est adapté pour couvrir le son en plus de l'intervalle.

### Popup « appliquer à toutes les prises »

- Elle s'affiche après « Valider » sur le son par défaut des rappels, seulement si au moins une prise active a un son différent du nouveau.
- Deux choix :
  - « Toutes les prises » : toutes les prises actives passent au nouveau son, y compris celles qui avaient un son personnalisé. La modification se fait sur place, puis les rappels sont replanifiés.
  - « Nouvelles prises uniquement ».

### Notifications

- iOS : tous les fichiers son sont déclarés dans `app.config.ts` (plugin `expo-notifications`). Chaque rappel utilise le son de sa prise, l'alerte de stock bas utilise `lowStockSound`.
- Android : le son d'un canal est figé à sa création, il faut donc un canal par son.
  - `intake-reminders` et `low-stock` restent pour `beep`. Les autres sons ont `intake-reminders-<clé>` et `low-stock-<clé>`.
  - Nom du canal : type et nom du son, ex. « Rappels de prise – Sonnette ».
  - À chaque replanification, on crée les canaux des sons utilisés et on supprime les autres.
- « Vibration seule » :
  - Android : canaux `intake-reminders-vibration` et `low-stock-vibration`, sans son, avec la vibration activée.
  - iOS : fichier silencieux `silence.wav`.
  - On teste d'abord sur l'iPhone qu'une notification avec ce son silencieux vibre bien. Si ce n'est pas le cas, l'option n'existe que sur Android, avec une liste de sons propre à chaque plateforme (`.ios.ts` / `.android.ts`, sans `Platform.OS`).
  - Testé sur l'iPhone, app fermée : la notification avec `silence.wav` vibre en mode sonnerie et en mode silencieux. « Vibration seule » existe donc sur les deux plateformes, avec une liste de sons commune.

### Script de génération des sons

- `scripts/generateSounds.mjs` est conservé, avec une cible `make sounds` (comme `make artwork`).
- On retire `gentle_alert` du script, et on y ajoute `silence.wav`.
- Une ligne de doc l'accompagne.

### Qualité

- Tests Jest : planification des rappels et des alertes, canaux Android, requêtes, écrans.
- Un flow Maestro :
  - choisir un son sur une prise, enregistrer, rouvrir la prise : le son est retenu ;
  - changer le son par défaut dans les réglages, avec la popup.
- Mise à jour de `docs/notifications.md` et de la section Schéma de `docs/database.md`.
