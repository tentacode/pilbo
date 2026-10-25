# Consignes pour Claude

IMPORTANT : LANGUE : TOUJOURS EN FRANÇAIS (réponses, plans, specs, docs, etc.), exception : tout dans le code doit être en anglais, y compris les commentaires.

## Mise à jour de ce fichier CLAUDE.md

Si besoin, mettre à jour ce fichier pour les prochains prompts, mais ne le faire qu'après ma validation et pas tout seul.

## Description du projet

La présentation du projet est dans `./README.md`. Le détail des fonctionnalités est dans les specs.

## Specs

Les specs sont dans `./specs`.

On me demandera parfois de travailler sur une spec précise : ne pas sortir du périmètre de la spec sans permission. S'il semble nécessaire d'affiner le périmètre, demander.

Les specs sont préfixées par un numéro d'ordre, ex. `./specs/01_setup_react_native.md`.

Une fois le plan validé, ne rien faire tout de suite : créer d'abord le plan dans `./plans/01_setup_react_native.md`. Chaque étape a une case à cocher pour savoir ce qui est fait et ce qui reste à faire. Maintenir les cases au fil de l'eau : cocher chacune dès que l'étape est faite et vérifiée (par toi, ou par moi si je le demande explicitement).

### Hors périmètre

- Tout ce qui n'est pas dans la spec.
- Android n'est absolument pas d'actualité pour l'instant.
- Certaines fonctionnalités avancées présentes dans le design mais pas nécessaires pour une proof of concept, ex. : l'éditeur de pilules.
- Widget iOS (Swift/WidgetKit + App Group, nécessite un compte Apple Developer payant) : sera traité plus tard. Il lira directement la base SQLite, donc le garder en tête : le fichier de base ira dans le conteneur App Group (paramètre `directory` de `openDatabaseSync`), et le schéma doit rester simple à requêter depuis Swift.

En gros, on cherche une proof of concept : dans le doute, demander si c'est dans le périmètre.

## Stack

- React Native avec **Expo**, en **development builds** (pas Expo Go). iOS uniquement.
- **TypeScript** en mode strict.
- Navigation : **Expo Router**.
  - Pour quitter des modales ouvertes en ignorant leurs modifications non enregistrées (sans dialogue d'abandon) : `leaveWithoutConfirmation` (`features/pillbox/hooks/useModalClosing.ts`).
- Stockage : **expo-sqlite + Drizzle ORM**, migrations générées par drizzle-kit. Comment travailler avec la base : voir `./docs/database.md`.
  - Mettre à jour la section **Schéma** de `docs/database.md` à chaque migration.
  - Une migration livrée sur TestFlight est figée. Entre deux livraisons, une seule migration « en cours », qui doit conserver les données des testeurs avant `make testflight`.
  - Le schéma Drizzle est la source de vérité des types (`$inferSelect` / `$inferInsert`).
  - Lectures : SQL brut avec le tag `sql` (``database.all<Type>(sql`...`)``), pas de query builder pour les selects. Référencer les colonnes du schéma (`${table.column}`) au lieu de noms en dur, et aliaser les colonnes en camelCase (`AS takenAt`).
  - Écritures : Drizzle ORM (`insert`, `update`, `delete`), conditions écrites avec `sql`.
  - Les types des résultats SQL bruts sont des casts : couvrir les repositories avec des tests Jest.
  - Les prises sont versionnées (`created_on` / `archived_on`) : toujours passer par `saveIntake` / `archiveIntake`, ne jamais modifier directement le planning d'une prise qui a un historique. Voir `docs/database.md`.
- État UI : état local ou contexte React d'abord. **Zustand** seulement si un état UI doit être partagé entre des composants éloignés. Jamais pour les données persistées (SQLite uniquement).
  - Exception : les petits réglages UI persistés (ex. `onboardingDone`, préférences dans `features/settings/store/settingsStore.ts`) utilisent Zustand `persist` avec `expo-sqlite/kv-store`, via le stockage synchrone partagé `shared/storage/synchronousStorage.ts` pour éviter un flash au démarrage.
- Données **100 % locales** : pas de backend, pas de compte utilisateur.
- i18n : **i18next + react-i18next + expo-localization** (français et anglais), clés = texte français, un namespace par feature, `make i18n-extract`. Voir la section i18n de `docs/architecture.md`.
- Notifications : **expo-notifications** (notifications locales programmées).
- Tests : **Jest + React Native Testing Library**.
- Qualité du code : **ESLint + Prettier**.
- L'app est testée sur un iPhone personnel via Xcode, avec un compte Apple Developer payant (équipe `APPLE_TEAM_ID`).

### Contraintes iOS à garder en tête

- J'ai un très petit téléphone (iPhone 12 mini) : le design doit être responsive et bien fonctionner sur ce téléphone.
- Maximum 64 notifications locales en attente en même temps : utiliser des rappels quotidiens répétés (1 emplacement chacun), reprogrammés quand une prise est validée.
- Mode silencieux : pas de son, mais vibration si « Retour haptique en mode silencieux » est activé.
- Profils de signature valables 1 an. Les rappels de prise sont en `timeSensitive` (ils traversent les modes de concentration), les alertes de stock bas en `active`.
- Nouveau bundle ID, nouvelle capacité ou nouvel appareil : `expo run:ios` ne crée pas le profil (« No profiles for… »). Lancer une fois `xcodebuild -workspace ios/Pilbo.xcworkspace -scheme Pilbo -configuration <Debug|Release> -destination id=<appareil> -allowProvisioningUpdates build` (après le prebuild de la variante voulue).
- `plugins/withoutPushEntitlement.js` retire l'entitlement push ajouté par `expo-notifications` ; il doit être déclaré **avant** `expo-notifications` dans `app.config.ts` (les mods iOS s'exécutent dans l'ordre inverse).
- `ios.appleTeamId` dans `app.config.ts` (lu depuis `APPLE_TEAM_ID` dans `.env`) conserve la team de signature après `npx expo prebuild --clean`.

## Commandes

Le gestionnaire de paquets est **pnpm**. Utiliser le `Makefile` (`make help` liste tout) :

- Deux variantes, choisies par `APP_VARIANT` (fixé par le Makefile, pas dans `.env`) : « Pilbo Dev » (`com.tentacode.pilbo.dev`, données de test) et « Pilbo » (`com.tentacode.pilbo`). Le dossier `ios/` (projet `Pilbo` pour les deux) est partagé : chaque cible de build le met à jour pour sa variante (`prebuild --no-clean`, Expo vide `ios/` par défaut sinon).
- `make start` : Metro seul (Fast Refresh, sans rebuild natif).
- `make build-simulator` / `make build-device` : « Pilbo Dev » en Debug. `make build-release` : « Pilbo » en Release (`DEVICE_ID` depuis `.env`).
- `make clean` : `expo prebuild --clean` (`APP_VARIANT=dev` par défaut).
- `make testflight` : « Pilbo » en Release envoyé sur TestFlight par fastlane (lane `beta`, `fastlane/Fastfile`) : numéro de build +1 automatique, envoi au groupe externe « Pilbo Externe ».
  - Clé API App Store Connect avec le rôle **Admin** (nécessaire pour la signature cloud), `.p8` hors du repo, identifiants dans `.env`.
  - fastlane tourne avec le Ruby Homebrew via Bundler ; le prebuild de la lane s'exécute hors de l'environnement Bundler (`Bundler.with_unbundled_env`), sinon `pod install` échoue.
- `make version-bump TYPE=major|minor|patch` : change `version` dans `app.config.ts`. Le premier build d'une nouvelle version repasse par la revue bêta d'Apple.
- `make tests` : lint, prettier, TypeScript, Jest et audit. Doit passer avant de considérer une étape terminée.
- `make test-e2e` : flows Maestro dans `e2e/` (« Pilbo Dev » doit être installée sur un simulateur démarré). Après une nouvelle installation, fermer l'alerte « Ouvrir dans « Pilbo Dev » ? » avant de lancer les flows. Si l'iPhone est branché, Maestro le cible et échoue : lancer `maestro --device <id du simulateur> test e2e/`.
  - Le CLI Maestro et le serveur MCP Maestro ne peuvent pas piloter le même simulateur en même temps (« Unable to set permissions… Failed to connect ») : utiliser l'un ou l'autre.
  - Un bouton caché sous le footer d'une modale (`Sheet`) est vu comme visible par Maestro, et le tap tombe sur le footer : `scroll` avant `tapOn`.
  - Si le CLI et le MCP Maestro échouent tous les deux (`Failed to connect`), redémarrer le simulateur : `xcrun simctl shutdown <id>` puis `xcrun simctl boot <id>`.
- `make db-generate` : générer une migration SQLite à partir de `src/shared/database/schema.ts`.
- Variante dev : au premier lancement, insère les données de test et passe l'onboarding (e2e). « Pilbo » ne charge jamais de données de test. La section debug dans l'app (supprimer les données, réinitialiser avec les données de test, simuler une erreur) apparaît après 10 taps sur « Version » dans les réglages.

## Conventions de code

Les conventions seront mises à jour au fil de l'avancement du projet.

Conventions :

- Architecture et règles de dossiers : voir `./docs/architecture.md`, à respecter.
- Ne jamais lancer d'opération git (commit, add, branch, stash, push, etc.), seule la lecture est autorisée (log, diff, show, status).
- Le code (noms de symboles, noms de fichiers) est écrit en anglais.
- Les textes de l'UI passent toujours par l'i18n (`t`), voir la section i18n de `docs/architecture.md`.
- Rester concis et modulaire.
- Toujours privilégier les petits composants.
- Préférer séparer le design et la logique.
- Ne jamais écrire de commentaires dans le code, sauf s'ils sont vitaux pour comprendre la logique ou un cas limite.
- Ne jamais abréger les noms de symboles (variables, noms de composants, props, etc.).
- Accessibilité : l'app doit être conforme WCAG AA, un effort particulier doit y être consacré, je testerai avec des lecteurs d'écran et des technologies d'assistance pour m'assurer que c'est valide. Concrètement :
  - `accessibilityLabel`, `accessibilityRole` et `accessibilityState` corrects sur les éléments interactifs.
  - Respecter le réglage de taille de texte iOS (Dynamic Type) sans casser les mises en page.
  - Contraste des couleurs AA.
  - Réduire les animations uniquement quand le réglage iOS « Réduire les animations » est activé.
  - Zones tactiles d'au moins 44 pt.
- Toujours utiliser des tokens pour les tailles/graisses de police, couleurs, dimensions, marges, etc.
- Les composants peuvent aller dans le design-system ou dans le dossier features.

## Ton de l'app

Les textes de l'UI (en français) se situent entre amical et corporate :

- Vouvoiement.
- Phrases courtes et légères.
- Suggestions plutôt qu'ordres (« Essayez de… »).
- Pas de jargon technique dans les messages principaux (détails techniques uniquement en texte secondaire).

## Plans et réponses

Tous les plans et réponses doivent être écrits en français (même quand je pose la question en anglais).

Les messages doivent être clairs, concis (éviter les longs paragraphes), organisés en sections, étape par étape si nécessaire : courts et clairs.

Toujours poser des questions si quelque chose doit être clarifié.
